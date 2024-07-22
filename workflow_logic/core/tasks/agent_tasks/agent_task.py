from typing import List, Dict, Optional, Tuple, Callable
from pydantic import Field
from workflow_logic.core.api import APIManager
from workflow_logic.core.api import ApiType
from workflow_logic.core.communication import MessageDict, TaskResponse, LLMChatOutput
from workflow_logic.core.agent.agent import PIKAAgent
from autogen.agentchat import ConversableAgent
from workflow_logic.core.tasks.task import PIKATask
from workflow_logic.core.parameters import FunctionParameters, ParameterDefinition, FunctionConfig
from workflow_logic.core.chat_functionality import ChatExecutionFunctionality

class BasicAgentTask(PIKATask):
    """
    A base class for agent-based tasks that use ChatExecutionFunctionality.

    This class sets up the basic structure for tasks that involve an agent interacting
    with a chat system, potentially executing functions or code.

    Attributes:
        agent (PIKAAgent): The primary agent responsible for generating responses.
        execution_agent (PIKAAgent): An agent responsible for executing code or functions.
        input_variables (FunctionParameters): Defines the expected input structure for the task.
        chat_execution (Optional[ChatExecutionFunctionality]): Handles the chat interaction and execution.

    Methods:
        setup_chat_execution: Initializes the ChatExecutionFunctionality if not already set.
        functions_list: Returns a list of available functions for the agent.
        get_combined_function_map: Creates a combined map of all available functions.
        get_autogen_agent: Returns the primary agent with necessary configurations.
        get_executor_agent: Returns the executor agent with necessary configurations.
        generate_response: Generates a response using the chat execution functionality.
        run: Executes the task and returns a TaskResponse.
        get_exit_code: Determines the exit code based on the chat output and response status.
    """
    agent: PIKAAgent = Field(..., description="The primary agent to use for the task")
    execution_agent: PIKAAgent = Field(
        default=PIKAAgent(
            name="default_executor",
            system_message={"name": "default_executor", "content": "Default executor agent."},
            autogen_class="UserProxyAgent",
            code_execution_config=False,
            default_auto_reply=""
        ),
        description="The executor agent. By default, it's set up without code execution capabilities."
    )
    input_variables: FunctionParameters = Field(
        default=FunctionParameters(
            type="object",
            properties={
                "messages": ParameterDefinition(
                    type="list",
                    description="A list of message dictionaries to use as input for the task.",
                    default=None
                )
            },
            required=["messages"]
        ),
        description="Inputs that the agent will require. Default is a list of messages."
    )
    required_apis: List[ApiType] = Field(['llm_api'], description="A list of required APIs for the task")
    chat_execution: Optional[ChatExecutionFunctionality] = Field(None, description="Chat execution functionality")

    def setup_chat_execution(self, api_manager: APIManager):
        if self.chat_execution is None:
            self.chat_execution = ChatExecutionFunctionality(
                llm_agent=self.get_autogen_agent(api_manager),
                execution_agent=self.get_executor_agent(api_manager),
                code_execution_config=self.executor.code_execution_config,
                valid_languages=["python", "shell"],
                return_output_to_agent=True
            )

    def functions_list(self, api_manager: APIManager) -> List[FunctionConfig]:
        return [func.get_function(api_manager)["tool_function"] for func in self.tasks.values()] if self.tasks else None
    
    def get_combined_function_map(self, api_manager: APIManager) -> Optional[Dict[str, Callable]]:
        combined_function_map = {}
        for func in self.tasks.values():
            function_details = func.get_function(api_manager=api_manager)
            combined_function_map.update(function_details["function_map"])
        return combined_function_map
    
    def get_autogen_agent(self, api_manager: APIManager) -> ConversableAgent:
        return self.agent.get_autogen_agent(api_manager=api_manager, functions_list=self.functions_list(api_manager=api_manager))

    def get_executor_agent(self, api_manager: APIManager) -> ConversableAgent:
        function_map = self.get_combined_function_map(api_manager=api_manager)
        return self.execution_agent.get_autogen_agent(function_map=function_map if function_map else None)
    
    async def generate_response(self, messages: List[MessageDict]) -> Tuple[List[MessageDict], bool]:
        return await self.chat_execution.take_turn(messages)
    
    async def run(self, api_manager: APIManager, **kwargs) -> TaskResponse:
        self.setup_chat_execution(api_manager)
        
        messages = kwargs.get('messages', [])
        new_messages, is_terminated = await self.generate_response(messages)
        
        exitcode = self.get_exit_code(new_messages, is_terminated)
        all_messages = messages + new_messages
        chat_output = LLMChatOutput(content=all_messages)
        
        return TaskResponse(
            task_id=self.id,
            task_name=self.task_name,
            task_description=self.task_description,
            status="complete" if exitcode == 0 else "failed",
            result_code=exitcode,
            task_outputs=str(chat_output),
            task_content=chat_output,
            task_inputs=kwargs,
            result_diagnostic="Task executed successfully." if not is_terminated else "Task execution terminated by the agent.",
            execution_history=kwargs.get("execution_history", [])
        )
    
    def get_exit_code(self, chat_output: List[MessageDict], response_code: bool) -> int:
        return 0 if (chat_output and 'content' in chat_output[-1]) else 1