from typing import Dict, Any, Optional, List, Callable, Union
from pydantic import Field
from workflow_logic.core.communication import TaskResponse
from workflow_logic.core.tasks.task import PIKATask
from workflow_logic.core.communication import WorkflowOutput

class Workflow(PIKATask):
    """
    A Workflow is a sequence of tasks that are executed in a defined order.
    Inherits from Task, so it can be used as a part of another workflow.
    """
    tasks: Dict[str, PIKATask] = Field(..., description="A dictionary of tasks in the workflow")
    start_task: Optional[str] = Field(None, description="The name of the starting task")
    task_selection_method: Optional[Callable[[TaskResponse, List[Dict[str, Any]]], Optional[str]]] = Field(None, description="A method to select the next task based on the current task's response")
    tasks_end_code_routing: Optional[Dict[str, Dict[int, tuple[Union[str, None], bool]]]] = Field(None, description="A dictionary of tasks -> exit codes and the task to route to given each exit code and a bool to determine if the outcome represents an extra 'try' at the task")
    max_attempts: int = Field(3, description="The maximum number of failed task attempts before the workflow is considered failed. Default is 3.")
    recursive: bool = Field(False, description="Whether the workflow can be executed recursively. By default, tasks are recursive but workflows are not, unless one is expected to be used within another workflow")
    
    def run(self, step_through: bool = False, **kwargs) -> TaskResponse:
        current_task_name = self.start_task if self.start_task else self.select_next_task(None, None)
        tasks_performed: List[TaskResponse] = []
        attempts = 1
        diagnostic = "Workflow completed successfully"
        status = "complete"
        task_inputs = kwargs.copy()
        while current_task_name:
            if current_task_name not in self.tasks:
                raise ValueError(f"Task {current_task_name} not found in the workflow.")
            task_result = self.tasks[current_task_name].execute(**kwargs)
            if not task_result:
                raise ValueError(f"Task {current_task_name} failed to execute.")
            tasks_performed.append(task_result)

            # Flatten outputs and messages into kwargs
            kwargs[f'outputs_{current_task_name}'] = str(task_result.task_outputs.__str__()) if task_result.task_outputs else None

            current_task_name, try_bool = self.select_next_task(task_result, tasks_performed)
            if try_bool:
                attempts += 1
                if attempts > self.max_attempts:
                    diagnostic = "Workflow ended due to maximum attempts reached."
                    status = "failed"
                    break
            if step_through:
                input("Press Enter to continue to the next step...")

        return TaskResponse(
            task_id=self.id if self.id else '',
            task_name=self.task_name,
            task_description=self.task_description,
            status=status,
            result_code=1 if status == "failed" else 0,
            task_outputs=str(WorkflowOutput(content=tasks_performed)),
            task_content=WorkflowOutput(content=tasks_performed),
            task_inputs=task_inputs,
            result_diagnostic=diagnostic,
            execution_history=kwargs.get("execution_history", [])
        )
    
    def select_next_task(self, task_response: Optional[TaskResponse], outputs: Optional[List[Dict[str, Any]]]) -> tuple[Optional[str], bool]:
        if self.task_selection_method:
            return self.task_selection_method(task_response, outputs)
        if not self.tasks_end_code_routing:
            raise ValueError("Either the task_selection_method or the tasks_end_code_routing needs to be defined.")
        
        # Default implementation
        if task_response is None:
            if self.start_task:
                return self.start_task
            print("No start task defined, selecting the first task.")
            return next(iter(self.tasks))
        if task_response.task_name not in self.tasks:
            raise ValueError(f"Task {task_response.task_name} not found in the workflow.")
        if (task_response.task_name not in self.tasks_end_code_routing) or (task_response.result_code not in self.tasks_end_code_routing[task_response.task_name]):
            raise ValueError(f"Exit code {task_response.result_code} not found for task {task_response.task_name}.")
        task, try_bool = self.tasks_end_code_routing[task_response.task_name][task_response.result_code]
        if task and task not in self.tasks:
            raise ValueError(f"Selected task {task} not found in the workflow.")
        return task, try_bool