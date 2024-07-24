import { User } from './UserTypes';
import { PIKATask, convertToPIKATask } from './TaskTypes';
import { PIKAAgent, convertToPIKAAgent } from './AgentTypes';
import { TaskResponse } from './TaskResponseTypes';
import { PIKAModel } from './ModelTypes';

export interface PIKAChat {
    _id: string;
    name: string;
    messages: MessageType[];
    pika_agent: PIKAAgent;
    functions?: PIKATask[];
    executor: PIKAAgent;
    model_id?: PIKAModel;
    task_responses?: TaskResponse[];
    created_by?: User;
    updated_by?: User;
    createdAt?: Date;
    updatedAt?: Date;
}

export type RoleType = 'user' | 'assistant' | 'system' | 'tool';
export type MessageTypeType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'TaskResponse';

export interface MessageType {
    role: RoleType;
    content: string;
    generated_by: 'user' | 'llm' | 'tool';
    step?: string;
    assistant_name?: string;
    context?: Record<string, any>;
    type?: MessageTypeType;
    request_type?: string | null;
    created_by?: User | null;
    updated_by?: User | null;
    createdAt?: Date;
    updatedAt?: Date;
    _id?: string;
}
export const convertToMessageType = (data: any): MessageType => {
    return {
        role: data?.role || 'user',
        content: data?.content || '',
        generated_by: data?.generated_by || 'user',
        step: data?.step || undefined,
        assistant_name: data?.assistant_name || undefined,
        context: data?.context || {},
        type: data?.type || 'text',
        request_type: data?.request_type || null,
        created_by: data?.created_by || null,
        updated_by: data?.updated_by || null,
        createdAt: data?.createdAt ? new Date(data.createdAt) : undefined,
        updatedAt: data?.updatedAt ? new Date(data.updatedAt) : undefined,
        _id: data?._id || undefined,
    };
};

export const convertToPIKAChat = (data: any): PIKAChat => {
    return {
        _id: data?._id || '',
        name: data?.name || '',
        messages: (data?.messages || []).map(convertToMessageType),
        pika_agent: convertToPIKAAgent(data?.pika_agent),
        functions: (data?.functions || []).map(convertToPIKATask),
        executor: convertToPIKAAgent(data?.executor),
        model_id: data?.model_id || undefined,
        task_responses: (data?.task_responses || []).map((response: any) => ({
            ...response,
            createdAt: response.createdAt ? new Date(response.createdAt) : undefined,
            updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
        })),
        created_by: data?.created_by || undefined,
        updated_by: data?.updated_by || undefined,
        createdAt: data?.createdAt ? new Date(data.createdAt) : undefined,
        updatedAt: data?.updatedAt ? new Date(data.updatedAt) : undefined,
    };
};

export interface MessageProps {
    message: MessageType
}

export interface CreatePIKAChat {
    name: string;
    pika_agent: string | PIKAAgent;
    executor: string | PIKAAgent;
    model_id?: string | PIKAModel;
    functions?: string[] | PIKATask[];
}

export interface ChatComponentProps {
    items: PIKAChat[] | null;
    item: PIKAChat | null;
    onChange: (newItem: Partial<PIKAChat>) => void;
    mode: 'create' | 'view' | 'edit';
    handleSave: () => Promise<void>;
    isInteractable?: boolean;
    onInteraction?: (chat: PIKAChat) => void;
    onView?: (chat: PIKAChat) => void;
    showRegenerate?: boolean;
    handleTaskClick?: (taskId: string) => void;
    handleTaskResultClick?: (taskResultId: string) => void;
    handleAgentClick?: (agentId: string) => void;
    showHeaders?: boolean;
}

export const getDefaultChatForm = (): Partial<PIKAChat> => ({
    name: '',
    messages: [],
    pika_agent: undefined,
    executor: undefined,
    model_id: undefined,
    functions: [],
    task_responses: [],
});