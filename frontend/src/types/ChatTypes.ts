import { convertToPopulatedTask, PopulatedTask } from './TaskTypes';
import { PIKAAgent, convertToPIKAAgent } from './AgentTypes';
import { BaseDatabaseObject, convertToBaseDatabaseObject, EnhancedComponentProps } from './CollectionTypes';
import { convertToUserCheckpoint, UserCheckpoint } from './UserCheckpointTypes';
import { convertToPopulatedDataCluster, PopulatedDataCluster } from './DataClusterTypes';
import { ChatThread, convertToChatThread, convertToPopulatedChatThread, PopulatedChatThread } from './ChatThreadTypes';

export enum CheckpointType {
    TOOL_CALL = "tool_call",
    CODE_EXECUTION = "code_execution",
}

// Type to enforce required checkpoint keys
export type RequiredCheckpoints = {
    [CheckpointType.TOOL_CALL]: UserCheckpoint;
    [CheckpointType.CODE_EXECUTION]: UserCheckpoint;
};
export interface PIKAChat extends BaseDatabaseObject {
    name: string;
    threads?: ChatThread[];
    pika_agent: PIKAAgent;
    agent_tools?: string[];
    retrieval_tools?: string[];
    default_user_checkpoints: RequiredCheckpoints;
    data_cluster?: string;
}

// Create a type for all fields that need different types in PopulatedPIKAChat
type PopulatedFields = {
    threads?: PopulatedChatThread[];
    agent_tools?: PopulatedTask[];
    retrieval_tools?: PopulatedTask[];
    data_cluster?: PopulatedDataCluster;
}

// Populated interface that extends base and overrides specific fields
export interface PopulatedPIKAChat extends Omit<PIKAChat, keyof PopulatedFields>, PopulatedFields {}


export const convertToPIKAChat = (data: any): PIKAChat => {
    const defaultCheckpoints: RequiredCheckpoints = {
        [CheckpointType.TOOL_CALL]: convertToUserCheckpoint(data?.default_user_checkpoints?.[CheckpointType.TOOL_CALL]) || {},
        [CheckpointType.CODE_EXECUTION]: convertToUserCheckpoint(data?.default_user_checkpoints?.[CheckpointType.CODE_EXECUTION]) || {},
    };

    return {
        ...convertToBaseDatabaseObject(data),
        name: data?.name || '',
        threads: (data?.threads || []).map(convertToChatThread),
        pika_agent: convertToPIKAAgent(data?.pika_agent),
        agent_tools: data?.agent_tools || [],
        retrieval_tools: data?.retrieval_tools || [],
        default_user_checkpoints: defaultCheckpoints,
        data_cluster: data?.data_cluster || undefined,
    };
};
export const convertToPopulatedPIKAChat = (data: any): PopulatedPIKAChat => {
    const defaultCheckpoints: RequiredCheckpoints = {
        [CheckpointType.TOOL_CALL]: convertToUserCheckpoint(data?.default_user_checkpoints?.[CheckpointType.TOOL_CALL]) || {},
        [CheckpointType.CODE_EXECUTION]: convertToUserCheckpoint(data?.default_user_checkpoints?.[CheckpointType.CODE_EXECUTION]) || {},
    };
    
    return {
        ...convertToBaseDatabaseObject(data),
        name: data?.name || '',
        threads: (data?.threads || []).map(convertToPopulatedChatThread),
        pika_agent: convertToPIKAAgent(data?.pika_agent),
        agent_tools: (data?.agent_tools || []).map(convertToPopulatedTask),
        default_user_checkpoints: defaultCheckpoints,
        data_cluster: data?.data_cluster ? convertToPopulatedDataCluster(data?.data_cluster) : undefined,
        retrieval_tools: (data?.retrieval_tools || []).map(convertToPopulatedTask),
    };
};
export const convertPopulatedToPIKAChat = (populatedChat: PopulatedPIKAChat): PIKAChat => {
    return {
        ...populatedChat,
        threads: populatedChat.threads?.map(thread => ({ ...thread, messages: thread.messages.map(message => message._id || '') })) || [],
        agent_tools: populatedChat.agent_tools?.map(task => task._id || ''),
        retrieval_tools: populatedChat.retrieval_tools?.map(task => task._id || ''),
        data_cluster: populatedChat.data_cluster?._id || '',
    };
};

export interface ChatComponentProps extends EnhancedComponentProps<PIKAChat | PopulatedPIKAChat> {
}

export const getDefaultChatForm = (): Partial<PopulatedPIKAChat> => ({
    name: '',
    threads: [],
    pika_agent: undefined,
    agent_tools: [],
    retrieval_tools: [],
    data_cluster: undefined,
});