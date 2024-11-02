import { PIKATask, convertToPIKATask } from './TaskTypes';
import { PIKAAgent, convertToPIKAAgent } from './AgentTypes';
import { BaseDatabaseObject, convertToBaseDatabaseObject, EnhancedComponentProps } from './CollectionTypes';
import { convertToMessageType, MessageType } from './MessageTypes';
import { UserCheckpoint } from './UserCheckpointTypes';
import { References } from './ReferenceTypes';

export interface PIKAChat extends BaseDatabaseObject {
    name: string;
    messages: MessageType[];
    pika_agent: PIKAAgent;
    functions?: PIKATask[];
    user_checkpoints?: { [key: string]: UserCheckpoint };
    data_cluster?: References;
}

export const convertToPIKAChat = (data: any): PIKAChat => {
    return {
        ...convertToBaseDatabaseObject(data),
        name: data?.name || '',
        messages: (data?.messages || []).map(convertToMessageType),
        pika_agent: convertToPIKAAgent(data?.pika_agent),
        functions: (data?.functions || []).map(convertToPIKATask),
        user_checkpoints: data?.user_checkpoints || {},
        data_cluster: data?.data_cluster || {},
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
    functions: [],
    user_checkpoints: {},
    data_cluster: {},
});