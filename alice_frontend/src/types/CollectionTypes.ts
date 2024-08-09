import { PIKAAgent, convertToPIKAAgent } from './AgentTypes';
import { PIKAChat, convertToPIKAChat } from './ChatTypes';
import { PIKAModel, convertToPIKAModel } from './ModelTypes';
import { PIKATask, convertToPIKATask } from './TaskTypes';
import { Prompt, convertToPrompt } from './PromptTypes';
import { TaskResponse, convertToTaskResponse } from './TaskResponseTypes';
import { ParameterDefinition, convertToParameterDefinition } from './ParameterTypes';
import { User, convertToUser } from './UserTypes';
import { API, convertToAPI } from './ApiTypes';

export type CollectionName = 'agents' | 'chats' | 'models' | 'tasks' | 'prompts' | 'taskresults' | 'users' | 'parameters' | 'apis';
export type CollectionElement = PIKAAgent | PIKAChat | PIKAModel | PIKATask | Prompt | TaskResponse | User | ParameterDefinition | API | User;
export type CollectionElementString = 'Agent' | 'Model' | 'Parameter' | 'Prompt' | 'Task' | 'TaskResponse' | 'Chat' | 'API';

export type CollectionType = {
    agents: PIKAAgent;
    chats: PIKAChat;
    models: PIKAModel;
    tasks: PIKATask;
    prompts: Prompt;
    taskresults: TaskResponse;
    users: User;
    parameters: ParameterDefinition;
    apis: API;
};

export const convertCollectionToElementName = <T extends CollectionName>(collectionName: T): CollectionElementMap[T] => {
    return collectionName.slice(0, -1) as CollectionElementMap[T];
};

export type ElementName = 'agent' | 'chat' | 'model' | 'task' | 'prompt' | 'taskresult' | 'user' | 'parameter' | 'api';

export type CollectionElementMap = {
    agents: 'agent';
    chats: 'chat';
    models: 'model';
    tasks: 'task';
    prompts: 'prompt';
    taskresults: 'taskresult';
    users: 'user';
    parameters: 'parameter';
    apis: 'api';
};

export const converters: { [K in CollectionName]: (data: any) => CollectionType[K] } = {
    agents: convertToPIKAAgent,
    chats: convertToPIKAChat,
    models: convertToPIKAModel,
    tasks: convertToPIKATask,
    prompts: convertToPrompt,
    taskresults: convertToTaskResponse,
    users: convertToUser,
    parameters: convertToParameterDefinition,
    apis: convertToAPI,
};

export type ComponentMode = 'create' | 'edit' | 'view' | 'list' | 'shortList' | 'table';

export interface HandleClickProps {
    handleModelClick?: (modelId: string) => void;
    handleAgentClick?: (agentId: string) => void;
    handleTaskClick?: (taskId: string) => void;
    handlePromptClick?: (promptId: string) => void;
    handleParameterClick?: (paramId: string) => void;
    handleApiClick?: (apiId: string) => void;
    handleTaskResultClick?: (taskResultId: string) => void;
}