import { Model, Types, Document } from 'mongoose';
import { IMessageDocument } from './message.interface';

// ChangeHistory interfaces
export interface IChangeHistory {
    previous_agent: Types.ObjectId | null;
    updated_agent: Types.ObjectId | null;
    previous_functions: Types.ObjectId[];
    updated_functions: Types.ObjectId[];
    changed_by: Types.ObjectId;
    timestamp: Date;
}

export interface IChangeHistoryDocument extends IChangeHistory, Document {
    apiRepresentation: () => any;
}

// PIKAChat interfaces
export interface IPIKAChat {
    name: string;
    messages: IMessageDocument[];
    changeHistory: IChangeHistoryDocument[];
    pika_agent: Types.ObjectId;
    functions: Types.ObjectId[];
    created_by: Types.ObjectId;
    updated_by: Types.ObjectId;
}

export interface IPIKAChatMethods {
    apiRepresentation(): any;
}

export interface IPIKAChatDocument extends IPIKAChat, Document, IPIKAChatMethods {
    createdAt: Date;
    updatedAt: Date;
}

export interface IPIKAChatModel extends Model<IPIKAChatDocument> {
    // Add any static methods here if needed
}