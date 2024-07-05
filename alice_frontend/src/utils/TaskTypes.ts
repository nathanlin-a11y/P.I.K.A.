import { PIKAAgent } from './AgentTypes';
import { Prompt } from "./PromptTypes";
import { FunctionParameters } from "./ParameterTypes";

export type TaskType = "CVGenerationTask" | "RedditSearchTask" | "APITask" | "WikipediaSearchTask" | "GoogleSearchTask" | "ExaSearchTask" | "ArxivSearchTask" | "BasicAgentTask" | "PromptAgentTask" | "CheckTask" | "CodeGenerationLLMTask" | "CodeExecutionLLMTask" | "AgentWithFunctions" | "Workflow";

export interface PIKATask {
  task_name: string;
  task_description: string;
  task_type: TaskType;
  input_variables: FunctionParameters | null;
  exit_codes: { [key: string]: string };
  recursive: boolean;
  templates: { [key: string]: Prompt };
  tasks: { [key: string]: PIKATask };
  valid_languages: string[];
  timeout: number | null;
  prompts_to_add: { [key: string]: Prompt } | null;
  exit_code_response_map: { [key: string]: number } | null;
  start_task?: string | null;
  task_selection_method?: CallableFunction | null;
  tasks_end_code_routing?: { [key: string]: { [key: number]: any } } | null;
  max_attempts?: number;
  agent_id?: PIKAAgent | null;
  execution_agent_id?: PIKAAgent | null;
  human_input?: boolean;
  created_by?: string;
  updated_by?: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
}

export const convertToPIKATask = (data: any): PIKATask => {
  return {
    task_name: data?.task_name || '',
    task_description: data?.task_description || '',
    task_type: data?.task_type || '',
    input_variables: data?.input_variables || null,
    exit_codes: data?.exit_codes || {},
    recursive: data?.recursive || false,
    templates: data?.templates || {},
    tasks: typeof data?.tasks === 'object' && data?.tasks !== null
      ? Object.fromEntries(Object.entries(data.tasks).map(([key, value]: [string, any]) => [key, value || value]))
      : {},
    valid_languages: data?.valid_languages || [],
    timeout: data?.timeout || null,
    prompts_to_add: data?.prompts_to_add || null,
    exit_code_response_map: data?.exit_code_response_map || null,
    start_task: data?.start_task || null,
    task_selection_method: data?.task_selection_method || null,
    tasks_end_code_routing: data?.tasks_end_code_routing || null,
    max_attempts: data?.max_attempts || undefined,
    agent_id: data?.agent_id || null,
    execution_agent_id: data?.execution_agent_id || null,
    human_input: data?.human_input || false,
    created_by: data?.created_by || '',
    updated_by: data?.updated_by || '',
    createdAt: data?.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data?.updatedAt ? new Date(data.updatedAt) : undefined,
    _id: data?._id || undefined,
  };
};

export const DefaultPIKATask: PIKATask = convertToPIKATask({});

// Base interface for all task forms
export interface BaseTaskForm {
  task_name: string;
  task_description: string;
  task_type: TaskType;
  agent_id: PIKAAgent | null;
  human_input: boolean;
  input_variables: FunctionParameters | null;
  templates: { [key: string]: Prompt };
  prompts_to_add: { [key: string]: Prompt } | null;
}

export interface PromptAgentTaskForm extends BaseTaskForm {}

export interface AgentWithFunctionsForm extends BaseTaskForm {
  tasks: { [key: string]: PIKATask };
  execution_agent_id: PIKAAgent | null;
}

export interface CheckTaskForm extends BaseTaskForm {
  exit_code_response_map: { [key: string]: number } | null;
}

export interface CodeExecutionLLMTaskForm extends BaseTaskForm {
  exit_codes: { [key: string]: string };
  valid_languages: string[];
  timeout: number | null;
}

export interface CodeGenerationLLMTaskForm extends BaseTaskForm {
  exit_codes: { [key: string]: string };
}

export interface WorkflowForm extends BaseTaskForm {
  tasks: { [key: string]: PIKATask };
  start_task: string | null;
  max_attempts: number;
  recursive: boolean;
}

export type AnyTaskForm = PromptAgentTaskForm | AgentWithFunctionsForm | CheckTaskForm | CodeExecutionLLMTaskForm | CodeGenerationLLMTaskForm | WorkflowForm;

export type TaskFormProps<T extends AnyTaskForm> = {
  form: T;
  setForm: (newForm: T) => void;
  agents: PIKAAgent[];
  prompts: Prompt[];
  availableTasks: PIKATask[];
  viewOnly: boolean;
};

export interface TaskComponentProps {
  items: PIKATask[] | null;
  item: PIKATask | null;
  onChange: (newItem: Partial<PIKATask>) => void;
  mode: 'create' | 'view' | 'edit';
  handleSave: () => Promise<void>;
  isInteractable?: boolean;
  onInteraction?: (task: PIKATask) => void;
  onAddTask?: (task: PIKATask) => void;
  showHeaders?: boolean;
}