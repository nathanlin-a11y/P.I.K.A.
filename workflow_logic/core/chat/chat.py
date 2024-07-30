from workflow_logic.util.logging_config import LOGGER
import traceback
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Callable, Any
from bson import ObjectId
from workflow_logic.util.communication import MessageDict
from workflow_logic.core.model import PIKAModel
from workflow_logic.core.agent import PIKAAgent
from workflow_logic.core.parameters import ToolFunction
from workflow_logic.core.prompt import Prompt
from workflow_logic.core.api import APIManager
from workflow_logic.core.tasks import PIKATask

class PIKAChat(BaseModel):
    """
    Represents a chat session with an AI assistant, managing the conversation flow and execution.

    This class encapsulates the properties and methods needed to create and manage
    a chat session, including the conversation history, associated agents, available
    functions, and chat execution functionality.

    Attributes:
        id (Optional[str]): The unique identifier for the chat session.
        name (str): The name of the chat session.
        messages (Optional[List[MessageDict]]): List of messages in the conversation history.
        pika_agent (PIKAAgent): The main AI agent for the chat.
        functions (Optional[List[PIKATask]]): List of available functions/tasks for the agent.
        model_id (PIKAModel): The language model associated with the chat.

    Methods:
        tool_list(api_manager: APIManager) -> List[FunctionConfig]:
            Returns a list of function configurations for the available tasks.
        tool_map(api_manager: APIManager) -> Optional[Dict[str, Callable]]:
            Combines all available function maps from the registered tasks.
        generate_response(api_manager: APIManager, new_message: Optional[str] = None) -> List[MessageDict]:
            Generates a response in the chat, processing any new user message.
        deep_validate_required_apis(api_manager: APIManager) -> Dict[str, Any]:
            Performs a deep validation of all required APIs for the chat and its functions.
    """
    id: Optional[str] = Field(default=None, description="The unique ID of the chat conversation, must match the ID in the database", alias="_id")
    name: str = Field("New Chat", description="The name of the chat conversation")
    messages: Optional[List[MessageDict]] = Field([], description="List of messages in the chat conversation")
    pika_agent: PIKAAgent = Field(
        default = PIKAAgent(
            name="PIKA",
            system_message=Prompt(
                name= "pika_default",
                content= "You are PIKA, an AI personal assistant powered by a suite of tools. Your job is to assist your user to the best of your abilities."
            ),
        ), 
        description="The PIKA agent object. Default is base PIKA Agent.")
    functions: Optional[List[PIKATask]] = Field([], description="List of functions to be registered with the agent")
    model_id: PIKAModel = Field(None, description="The model object for the chat conversation")
    model_config = ConfigDict(protected_namespaces=(), json_encoders = {ObjectId: str})

    def tool_list(self, api_manager: APIManager) -> List[ToolFunction]:
        return [func.get_function(api_manager)["tool_function"].model_dump() for func in self.functions] if self.functions else None
    
    def tool_map(self, api_manager: APIManager) -> Optional[Dict[str, Callable]]:
        combined_function_map = {}
        for func in self.functions:
            function_details = func.get_function(api_manager=api_manager)
            combined_function_map.update(function_details["function_map"])
        return combined_function_map

    async def generate_response(self, api_manager: APIManager, new_message: Optional[str] = None) -> List[MessageDict]:
        try:
            if new_message:
                if not self.messages: self.messages = []
                self.messages.append(MessageDict(role="user", content=new_message, generated_by="user", type="text"))
            
            new_messages = await self.pika_agent.generate_response(api_manager=api_manager, messages=self.messages, tool_map=self.tool_map(api_manager), tools_list=self.tool_list(api_manager))
            LOGGER.info(f"New messages generated: {new_messages}")
            self.messages.extend(new_messages)
            return new_messages
        except Exception as e:
            LOGGER.error(f"Error in generate_response: {str(e)}")
            LOGGER.error(f"Traceback: {traceback.format_exc()}")
            return []
    
    def deep_validate_required_apis(self, api_manager: APIManager) -> Dict[str, Any]:
        result = {
            "chat_name": self.name,
            "status": "valid",
            "warnings": [],
            "llm_api": "valid",
            "functions": []
        }
        
        # Check LLM API
        try:
            api_manager.retrieve_api_data("llm_api", self.model_id)
        except ValueError as e:
            result["status"] = "warning"
            result["llm_api"] = "invalid"
            result["warnings"].append(str(e))
        
        # Check functions
        for func in self.functions:
            func_result = func.deep_validate_required_apis(api_manager)
            result["functions"].append(func_result)
            if func_result["status"] == "warning":
                result["status"] = "warning"
                result["warnings"].extend(func_result["warnings"])
        
        return result