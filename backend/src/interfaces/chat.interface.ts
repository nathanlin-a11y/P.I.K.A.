import { Model, Types, Document } from 'mongoose';
import { IMessageDocument } from './message.interface';
import { ITaskDocument } from './task.interface';
import { IAgentDocument } from './agent.interface';
import { IUserDocument } from './user.interface';
import { IUserCheckpointDocument } from './userCheckpoint.interface';
import { IDataClusterDocument } from './references.interface';

// ChangeHistory interfaces
export interface IChangeHistory {
    previous_agent: Types.ObjectId | null | IAgentDocument;
    updated_agent: Types.ObjectId | null | IAgentDocument;
    previous_agent_tools: Types.ObjectId[] | ITaskDocument[];
    updated_agent_tools: Types.ObjectId[] | ITaskDocument[];
    changed_by: Types.ObjectId | IUserDocument;
    timestamp: Date;
}

export interface IChangeHistoryDocument extends IChangeHistory, Document {
    apiRepresentation: () => any;
}

// PIKAChat interfaces
export interface IPIKAChat {
    name: string;
    messages: Types.ObjectId[] | IMessageDocument[];
    changeHistory: IChangeHistoryDocument[];
    pika_agent: Types.ObjectId | IAgentDocument;
    agent_tools: Types.ObjectId[] | ITaskDocument[];
    retrieval_tools: Types.ObjectId[] | ITaskDocument[];
    data_cluster: Types.ObjectId | IDataClusterDocument;
    default_user_checkpoints: { [key: string]: Types.ObjectId[] | IUserCheckpointDocument };
    created_by: Types.ObjectId | IUserDocument;
    updated_by: Types.ObjectId | IUserDocument;
}

export interface IPIKAChatMethods {
    apiRepresentation(): any;
}

export interface IPIKAChatDocument extends IPIKAChat, Document, IPIKAChatMethods {
    _id: Types.ObjectId; 
    createdAt: Date;
    updatedAt: Date;
}

export interface IPIKAChatModel extends Model<IPIKAChatDocument> {
    // Add any static methods here if needed
}