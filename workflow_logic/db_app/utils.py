from workflow_logic.core.tasks import APITask, PIKATask, Workflow, PromptAgentTask, CheckTask, CodeGenerationLLMTask, CodeExecutionLLMTask, WebScrapeBeautifulSoupTask, EmbeddingTask, GenerateImageTask, TextToSpeechTask

available_task_types: list[PIKATask] = [
    Workflow,
    PromptAgentTask,
    CodeGenerationLLMTask,
    CodeExecutionLLMTask,
    CheckTask,
    APITask,
    EmbeddingTask,
    GenerateImageTask,
    TextToSpeechTask,
    WebScrapeBeautifulSoupTask
]