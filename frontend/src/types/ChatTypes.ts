import { PIKATask, convertToPIKATask } from './TaskTypes';
import { PIKAAgent, convertToPIKAAgent } from './AgentTypes';
import { BaseDatabaseObject, convertToBaseDatabaseObject, EnhancedComponentProps } from './CollectionTypes';
import { convertToMessageType, MessageType } from './MessageTypes';
import { convertToUserCheckpoint, UserCheckpoint } from './UserCheckpointTypes';
import { convertToDataCluster, DataCluster } from './DataClusterTypes';

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
    messages: MessageType[];
    pika_agent: PIKAAgent;
    agent_tools?: PIKATask[];
    retrieval_tools?: PIKATask[];
    default_user_checkpoints: RequiredCheckpoints;
    data_cluster?: DataCluster;
}

export const convertToPIKAChat = (data: any): PIKAChat => {
    const defaultCheckpoints: RequiredCheckpoints = {
        [CheckpointType.TOOL_CALL]: convertToUserCheckpoint(data?.default_user_checkpoints?.[CheckpointType.TOOL_CALL]) || {},
        [CheckpointType.CODE_EXECUTION]: convertToUserCheckpoint(data?.default_user_checkpoints?.[CheckpointType.CODE_EXECUTION]) || {},
    };

    return {
        ...convertToBaseDatabaseObject(data),
        name: data?.name || '',
        messages: (data?.messages || []).map(convertToMessageType),
        pika_agent: convertToPIKAAgent(data?.pika_agent),
        agent_tools: (data?.agent_tools || []).map(convertToPIKATask),
        default_user_checkpoints: defaultCheckpoints,
        data_cluster: data?.data_cluster ? convertToDataCluster(data?.data_cluster) : undefined,
        retrieval_tools: (data?.retrieval_tools || []).map(convertToPIKATask),
    };
};

export interface MessageProps {
    message: MessageType;
    chatId?: string;
}

export interface ChatComponentProps extends EnhancedComponentProps<PIKAChat> {
    showRegenerate?: boolean;
}

export const getDefaultChatForm = (): Partial<PIKAChat> => ({
    name: '',
    messages: [],
    pika_agent: undefined,
    agent_tools: [],
    data_cluster: {},
    retrieval_tools: undefined,
});