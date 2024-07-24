import { PIKAAgent, convertToPIKAAgent } from '../utils/AgentTypes';
import { PIKAChat, convertToPIKAChat } from '../utils/ChatTypes';
import { PIKAModel, convertToPIKAModel } from '../utils/ModelTypes';
import { PIKATask, convertToPIKATask } from '../utils/TaskTypes';
import { Prompt, convertToPrompt } from '../utils/PromptTypes';
import { TaskResponse, convertToTaskResponse } from '../utils/TaskResponseTypes';
import { ParameterDefinition, convertToParameterDefinition } from '../utils/ParameterTypes';
import { User, convertToUser } from '../utils/UserTypes';
import { API, convertToAPI } from '../utils/ApiTypes';

export type CollectionName = 'agents' | 'chats' | 'models' | 'tasks' | 'prompts' | 'taskresults' | 'users' | 'parameters' | 'apis';

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
