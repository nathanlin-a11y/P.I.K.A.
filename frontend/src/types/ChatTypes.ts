import { BaseDataseObject } from './UserTypes';
import { PIKATask, convertToPIKATask } from './TaskTypes';
import { PIKAAgent, convertToPIKAAgent } from './AgentTypes';
import { EnhancedComponentProps } from './CollectionTypes';
import { convertToMessageType, MessageType } from './MessageTypes';
import { UserCheckpoint } from './UserCheckpointTypes';
import { References } from './ReferenceTypes';

export interface PIKAChat extends BaseDataseObject {
    _id: string;
    name: string;
    messages: MessageType[];
    pika_agent: PIKAAgent;
    functions?: PIKATask[];
    user_checkpoints?: { [key: string]: UserCheckpoint };
    data_cluster?: References;
}

export const convertToPIKAChat = (data: any): PIKAChat => {
    return {
        _id: data?._id || '',
        name: data?.name || '',
        messages: (data?.messages || []).map(convertToMessageType),
        pika_agent: convertToPIKAAgent(data?.pika_agent),
        functions: (data?.functions || []).map(convertToPIKATask),
        user_checkpoints: data?.user_checkpoints || {},
        data_cluster: data?.data_cluster || {},
        created_by: data?.created_by || undefined,
        updated_by: data?.updated_by || undefined,
        createdAt: data?.createdAt ? new Date(data.createdAt) : undefined,
        updatedAt: data?.updatedAt ? new Date(data.updatedAt) : undefined,
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