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

export const convertToUser = (data: any): User => {
    return {
        ...convertToBasicDBObj(data),
        name: data?.name || '',
        email: data?.email || '',
        role: data?.role || 'user',
        default_chat_config: data?.default_chat_config || {},
    };
};