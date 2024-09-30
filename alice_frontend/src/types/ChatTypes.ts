import { BaseDataseObject, User } from './UserTypes';
import { PIKATask, convertToPIKATask } from './TaskTypes';
import { PIKAAgent, convertToPIKAAgent } from './AgentTypes';
import { HandleClickProps } from './CollectionTypes';
import { convertToMessageType, MessageType } from './MessageTypes';

export interface PIKAChat extends BaseDataseObject {
    _id: string;
    name: string;
    messages: MessageType[];
    pika_agent: PIKAAgent;
    functions?: PIKATask[];
}

export const convertToPIKAChat = (data: any): PIKAChat => {
    return {
        _id: data?._id || '',
        name: data?.name || '',
        messages: (data?.messages || []).map(convertToMessageType),
        pika_agent: convertToPIKAAgent(data?.pika_agent),
        functions: (data?.functions || []).map(convertToPIKATask),
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

export interface ChatComponentProps extends HandleClickProps {
    items: PIKAChat[] | null;
    item: PIKAChat | null;
    onChange: (newItem: Partial<PIKAChat>) => void;
    mode: 'create' | 'view' | 'edit';
    handleSave: () => Promise<void>;
    isInteractable?: boolean;
    onInteraction?: (chat: PIKAChat) => void;
    onView?: (chat: PIKAChat) => void;
    showRegenerate?: boolean;
    showHeaders?: boolean;
}

export const getDefaultChatForm = (): Partial<PIKAChat> => ({
    name: '',
    messages: [],
    pika_agent: undefined,
    functions: [],
});