import traceback
from workflow_logic.util.logging_config import LOGGER
from unittest.mock import patch, AsyncMock
from typing import Dict, Any, List
from workflow_logic.tests.component_tests.test_environment import TestModule
from workflow_logic.db_app import DBInitManager
from workflow_logic.core.api import APIManager
from workflow_logic.core.chat.chat import PIKAChat
from workflow_logic.core.communication import MessageDict

class ChatTests(TestModule):
    name: str = "ChatTests"

    async def run(self, db_init_manager: DBInitManager, **kwargs) -> Dict[str, Any]:
        test_results = {}
        api_manager = self.setup_api_manager(db_init_manager)
        
        chats = self.get_chats(db_init_manager)
        for chat in chats:
            chat_test_results = await self.run_chat_tests(chat, api_manager)
            test_results[chat.name] = chat_test_results

        return {
            "test_results": test_results,
            "outputs": {"available_chats": [name for name, results in test_results.items() if all(result == "Success" for result in results.values())]}
        }

    def setup_api_manager(self, db_init_manager: DBInitManager) -> APIManager:
        api_manager = APIManager()
        for api in db_init_manager.entity_obj_key_map.get("apis", {}).values():
            api_manager.add_api(api)
        return api_manager

    def get_chats(self, db_init_manager: DBInitManager) -> List[PIKAChat]:
        chats = []
        for chat_data in db_init_manager.entity_obj_key_map.get("chats", {}).values():
            if isinstance(chat_data, dict):
                chats.append(PIKAChat(**chat_data))
            elif isinstance(chat_data, PIKAChat):
                chats.append(chat_data)
            else:
                raise ValueError(f"Unexpected chat data type: {type(chat_data)}")
        return chats

    async def run_chat_tests(self, chat: PIKAChat, api_manager: APIManager) -> Dict[str, str]:
        return {
            "basic_response": await self.test_basic_response(chat, api_manager),
            "multi_turn_conversation": await self.test_multi_turn_conversation(chat, api_manager),
            "function_execution": await self.test_function_execution(chat, api_manager) if chat.functions else "Skipped",
            "code_execution": await self.test_code_execution(chat, api_manager) if chat.pika_agent.has_code_exec else "Skipped",
        }

    async def test_basic_response(self, chat: PIKAChat, api_manager: APIManager) -> str:
        test_message = "Hello, how are you?"
        try:
            response = await chat.generate_response(api_manager, test_message)
            self.log_response(response)
            if isinstance(response, list) and len(response) > 0 and response[0]['role'] == "assistant":
                return "Success"
            else:
                return f"Failed: Unexpected response format - {response}"
        except Exception as e:
            LOGGER.error(f"Error in test_basic_response: {str(e)}")
            LOGGER.error(traceback.format_exc())
            return f"Error: {str(e)}"

    async def test_multi_turn_conversation(self, chat: PIKAChat, api_manager: APIManager) -> str:
        messages = [
            "Hello, who are you?",
            "What's your favorite color?",
            "Why do you like that color?"
        ]
        try:
            for message in messages:
                response = await chat.generate_response(api_manager, message)
                self.log_response(response)
                if not isinstance(response, list) or len(response) == 0:
                    return f"Failed: Unexpected response format - {response}"
            
            if len(chat.messages) >= len(messages) * 2:
                return "Success"
            else:
                return f"Failed: Unexpected chat history length - {len(chat.messages)}"
        except Exception as e:
            LOGGER.error(f"Error in test_multi_turn_conversation: {str(e)}")
            LOGGER.error(traceback.format_exc())
            return f"Error: {str(e)}"

    async def simulate_function_call(self, api_type, model, **kwargs):
        # Simulate an API response that includes a function call
        return MessageDict(
            role="assistant",
            content="I'm calling a function to help with your request.",
            tool_calls=[{
                "id": "call_123",
                "type": "function",
                "function": {
                    "name": "mock_function",
                    "arguments": '{"arg1": "value1", "arg2": "value2"}'
                }
            }]
        )

    async def test_function_execution(self, chat: PIKAChat, api_manager: APIManager) -> str:
        try:

            # Patch the generate_response_with_api_engine method
            with patch.object(APIManager, 'generate_response_with_api_engine', new=self.simulate_function_call):
                test_message = "Execute a function for me."
                response = await chat.generate_response(api_manager, test_message)
                self.log_response(response)

            if any(msg['role'] == "tool" for msg in response):
                return "Success"
            else:
                return f"Failed: Function call not detected in response - {response}"
        except Exception as e:
            LOGGER.error(f"Error in test_function_execution: {str(e)}")
            LOGGER.error(traceback.format_exc())
            return f"Error: {str(e)}"

    async def test_code_execution(self, chat: PIKAChat, api_manager: APIManager) -> str:
        try:
            # Mock code execution
            with patch('workflow_logic.core.agent.PIKAAgent._execute_code_in_docker', new_callable=AsyncMock) as mock_execute:
                mock_execute.return_value = (0, "Mocked code execution output", None)

                test_message = "Write a Python function to calculate the factorial of a number."
                response = await chat.generate_response(api_manager, test_message)
                self.log_response(response)

                if mock_execute.called and any(msg.role == "tool" and msg.step == "code_execution" for msg in response):
                    return "Success"
                else:
                    return f"Failed: Code execution not detected in response - {response}"
        except Exception as e:
            LOGGER.error(f"Error in test_code_execution: {str(e)}")
            LOGGER.error(traceback.format_exc())
            return f"Error: {str(e)}"

    @staticmethod
    def log_response(response: List[MessageDict]):
        for msg in response:
            LOGGER.info(f"Role: {msg['role']}, Content: {msg['content'][:100]}...")  # Log first 100 chars of content
            if msg.get('tool_calls'):
                LOGGER.info(f"Tool Calls: {msg['tool_calls']}")
            if msg.get('function_call'):
                LOGGER.info(f"Function Call: {msg['function_call']}")