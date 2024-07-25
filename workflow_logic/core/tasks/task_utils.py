from workflow_logic.core.tasks import APITask, PIKATask, Workflow, BasicAgentTask, PromptAgentTask, CheckTask, CodeGenerationLLMTask, CodeExecutionLLMTask
from pydantic import BaseModel
from typing import Any, Dict

available_task_types: list[PIKATask] = [
    Workflow,
    PromptAgentTask,
    CodeGenerationLLMTask,
    CodeExecutionLLMTask,
    CheckTask,
    BasicAgentTask,
    APITask
]
class TaskExecutionRequest(BaseModel):
    taskId: str
    inputs: Dict[str, Any]