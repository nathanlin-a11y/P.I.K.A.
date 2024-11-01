import { BaseDataseObject } from "./UserTypes";
import { PIKAModel, ModelType } from "./ModelTypes";
import { Prompt } from "./PromptTypes";
import { EnhancedComponentProps } from "./CollectionTypes";

export enum ToolPermission {
  DISABLED = 0,
  NORMAL = 1,
  WITH_PERMISSION = 2,
  DRY_RUN = 3
}
export enum CodePermission {
  DISABLED = 0,
  NORMAL = 1,
  WITH_PERMISSION = 2,
  TAGGED_ONLY = 3
}

export interface PIKAAgent extends BaseDataseObject {
  _id?: string;
  name: string;
  system_message: Prompt;
  has_tools: ToolPermission;
  has_code_exec: CodePermission;
  max_consecutive_auto_reply?: number;
  models?: { [key in ModelType]?: PIKAModel };
}

export const convertToPIKAAgent = (data: any): PIKAAgent => {
  return {
    _id: data?._id || undefined,
    name: data?.name || '',
    system_message: data?.system_message || {},
    has_tools: data?.has_tools || 0,
    has_code_exec: data?.has_code_exec || 0,
    max_consecutive_auto_reply: data?.max_consecutive_auto_reply || undefined,
    models: data?.models || {},
    created_by: data?.created_by || undefined,
    updated_by: data?.updated_by || undefined,
    createdAt: data?.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data?.updatedAt ? new Date(data.updatedAt) : undefined,
  };
};

export interface AgentComponentProps extends EnhancedComponentProps<PIKAAgent> {
}

export const getDefaultAgentForm = (): Partial<PIKAAgent> => ({
  name: '',
  system_message: undefined,
  max_consecutive_auto_reply: 1,
  has_tools: 0,
  has_code_exec: 0,
  models: {},
});