import { PIKAAgent } from "./AgentTypes";
import { RequiredCheckpoints } from "./ChatTypes";
import { BasicDBObj, convertToBasicDBObj } from "./CollectionTypes";
import { DataCluster } from "./DataClusterTypes";
import { PIKATask } from "./TaskTypes";

export interface UserDefaultChatConfig {
    pika_agent: PIKAAgent;
    agent_tools: PIKATask[];
    retrieval_tools: PIKATask[];
    data_cluster?: DataCluster;
    default_user_checkpoints: RequiredCheckpoints;
}
export interface User extends BasicDBObj {
    name: string;
    email: string;
    role?: 'user' | 'admin';
    default_chat_config?: UserDefaultChatConfig;
}

export const converToUserDefaultChatConfig = (data: any): UserDefaultChatConfig => {
    return {
        pika_agent: data?.pika_agent || {},
        agent_tools: data?.agent_tools || [],
        retrieval_tools: data?.retrieval_tools || [],
        data_cluster: data?.data_cluster || {},
        default_user_checkpoints: data?.default_user_checkpoints || {},
    };
}

export const convertToUser = (data: any): User => {
    return {
        ...convertToBasicDBObj(data),
        name: data?.name || '',
        email: data?.email || '',
        role: data?.role || 'user',
        default_chat_config: converToUserDefaultChatConfig(data?.default_chat_config),
    };
};