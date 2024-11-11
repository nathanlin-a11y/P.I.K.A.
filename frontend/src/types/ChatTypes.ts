import { PIKATask, convertToPIKATask } from './TaskTypes';
import { PIKAAgent, convertToPIKAAgent } from './AgentTypes';
import { BaseDatabaseObject, convertToBaseDatabaseObject, EnhancedComponentProps } from './CollectionTypes';
import { convertToMessageType, MessageType } from './MessageTypes';
import { UserCheckpoint } from './UserCheckpointTypes';
import { convertToDataCluster, DataCluster } from './DataClusterTypes';

export interface PIKAChat extends BaseDatabaseObject {
    name: string;
    messages: MessageType[];
    pika_agent: PIKAAgent;
    agent_tools?: PIKATask[];
    default_user_checkpoints?: { [key: string]: UserCheckpoint };
    data_cluster?: DataCluster;
    retrieval_tools?: PIKATask[];
}

export const convertToPIKAChat = (data: any): PIKAChat => {
    return {
        ...convertToBaseDatabaseObject(data),
        name: data?.name || '',
        messages: (data?.messages || []).map(convertToMessageType),
        pika_agent: convertToPIKAAgent(data?.pika_agent),
        agent_tools: (data?.agent_tools || []).map(convertToPIKATask),
        default_user_checkpoints: data?.default_user_checkpoints || undefined,
        data_cluster: data?.data_cluster ? convertToDataCluster(data?.data_cluster) : undefined,
        retrieval_tools: (data?.retrieval_tools || []).map(convertToPIKATask),
    };
};

export interface MessageProps {
    message: MessageType,
    chatId?: string,
}

export interface ChatComponentProps extends EnhancedComponentProps<PIKAChat> {
    
}

export const getDefaultChatForm = (): Partial<PIKAChat> => ({
    name: '',
    messages: [],
    pika_agent: undefined,
    agent_tools: [],
    default_user_checkpoints: {},
    data_cluster: {},
    retrieval_tools: undefined,
});