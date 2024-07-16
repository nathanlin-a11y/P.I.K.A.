from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from bson import ObjectId
from workflow_logic.core.communication import MessageDict
from workflow_logic.core.model import PIKAModel
from workflow_logic.core.agent import PIKAAgent
from workflow_logic.core.parameters import FunctionConfig
from workflow_logic.core.api import APIManager
from workflow_logic.core.tasks import PIKATask
from autogen.agentchat import ConversableAgent
from workflow_logic.core.chat.chat_execution_functionality import ChatExecutionFunctionality

default_system_message = {
    "name": "pika_default",
    "content": "You are PIKA, an AI personal assistant powered by a suite of tools. Your job is to assist your user to the best of your abilities."
}

class PIKAChat(BaseModel):
    id: str = Field(default="", description="The unique ID of the chat conversation, must match the ID in the database", alias="_id")
    name: str = Field("New Chat", description="The name of the chat conversation")
    messages: List[MessageDict] = Field(..., description="List of messages in the chat conversation")
    pika_agent: PIKAAgent = Field(
        default = PIKAAgent(
            name="PIKA",
            system_message=default_system_message,
        ), 
        description="The PIKA agent object. Default is base PIKA Agent.")
    functions: Optional[List[PIKATask]] = Field([], description="List of functions to be registered with the agent")
    executor: PIKAAgent = Field(
        default = PIKAAgent(name="executor_agent", 
                             system_message={"name": "executor_agent", "content":"Executor Agent. Executes the code and returns the result."}, 
                             autogen_class="UserProxyAgent", 
                             code_execution_config=True, 
                             default_auto_reply=""),
        description="The executor agent object. Default is base PIKA Agent.")
    model_id: PIKAModel = Field(None, description="The model object for the chat conversation")
    chat_execution: Optional[ChatExecutionFunctionality] = Field(None, description="Chat execution functionality")
    model_config = ConfigDict(protected_namespaces=(), json_encoders = {ObjectId: str})

    @property
    def functions_list(self) -> List[FunctionConfig]:
        return [func.get_function()["tool_function"] for func in self.functions] if self.functions else None

    def setup_chat_execution(self, api_manager):
        if self.chat_execution is None:
            llm_agent = self.get_autogen_agent(api_manager)
            execution_agent = self.get_default_executor()
            
            functions = [task.get_function()["tool_function"] for task in self.functions] if self.functions else None
            
            self.chat_execution = ChatExecutionFunctionality(
                llm_agent=llm_agent,
                execution_agent=execution_agent,
                functions=functions,
                code_execution_config=self.executor.code_execution_config,
                valid_languages=["python", "shell"],  # You may want to make this configurable
                return_output_to_agent=True  # You may want to make this configurable
            )

    def generate_response(self, api_manager, new_message: Optional[str] = None) -> List[MessageDict]:
        self.setup_chat_execution(api_manager)
        
        if new_message:
            self.messages.append(MessageDict(role="user", content=new_message, generated_by="user", type="text"))
        
        new_messages, is_terminated = self.chat_execution.take_turn(self.messages)
        self.messages.extend(new_messages)
        
        return new_messages

    def get_autogen_agent(self, api_manager: APIManager) -> ConversableAgent:
        return self.pika_agent.get_autogen_agent(api_manager=api_manager, functions_list=self.functions_list)    
    
    def get_default_executor(self) -> ConversableAgent:
        return self.executor.get_autogen_agent({func.get_function()["function_map"] for func in self.functions} if self.functions else None)
    
    def inject_llm_config(self, task: PIKATask) -> PIKATask:
        llm_config = self.llm_config.model_dump() if self.llm_config else None
        if task.agent and not task.agent.llm_config:
            task.agent.llm_config = llm_config
        return task