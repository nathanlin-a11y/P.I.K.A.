import mongoose, { Schema } from 'mongoose';
import { IChangeHistoryDocument, IPIKAChatDocument, IPIKAChatModel } from '../interfaces/chat.interface';
import { ensureObjectIdHelper } from '../utils/utils';

// ChangeHistory schema
const changeHistorySchema = new Schema<IChangeHistoryDocument>({
  previous_agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: false },
  updated_agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: false },
  previous_functions: [{ type: Schema.Types.ObjectId, ref: 'Task', required: false }],
  updated_functions: [{ type: Schema.Types.ObjectId, ref: 'Task', required: false }],
  changed_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

changeHistorySchema.methods.apiRepresentation = function (this: IChangeHistoryDocument) {
  return {
    id: this._id,
    previous_agent: this.previous_agent ? (this.previous_agent._id || this.previous_agent) : null,
    updated_agent: this.updated_agent ? (this.updated_agent._id || this.updated_agent) : null,
    previous_functions: this.previous_functions.map(func => func._id || func),
    updated_functions: this.updated_functions.map(func => func._id || func),
    changed_by: this.changed_by ? (this.changed_by._id || this.changed_by) : null,
    timestamp: this.timestamp || null
  };
};

// PIKAChat schema
const pikaChatSchema = new Schema<IPIKAChatDocument, IPIKAChatModel>({
  name: { type: String, default: "New Chat", description: "Name of the chat" },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }], 
  changeHistory: [{ type: changeHistorySchema, default: [], description: "List of changes in the chat conversation" }],
  pika_agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: true, description: "The PIKA agent object" },
  functions: [{ type: Schema.Types.ObjectId, ref: 'Task', default: [], description: "List of functions to be registered with the agent" }],
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

pikaChatSchema.methods.apiRepresentation = function (this: IPIKAChatDocument) {
  return {
    id: this._id,
    messages: this.messages.map((message) => message.apiRepresentation()),
    changeHistory: this.changeHistory.map((change) => change.apiRepresentation()),
    pika_agent: this.pika_agent ? (this.pika_agent._id || this.pika_agent) : null,
    functions: this.functions.map((func) => func._id || func),
    created_by: this.created_by ? (this.created_by._id || this.created_by) : null,
    updated_by: this.updated_by ? (this.updated_by._id || this.updated_by) : null,
    createdAt: this.createdAt || null,
    updatedAt: this.updatedAt || null,
  };
};

function ensureObjectIdForSave(
  this: IPIKAChatDocument,
  next: mongoose.CallbackWithoutResultAndOptionalError
) {
  if (this.pika_agent) this.pika_agent = ensureObjectIdHelper(this.pika_agent);
  if (this.created_by) this.created_by = ensureObjectIdHelper(this.created_by);
  if (this.updated_by) this.updated_by = ensureObjectIdHelper(this.updated_by);
  if (this.functions) {
    this.functions = this.functions.map((func) => ensureObjectIdHelper(func));
  }
  if (this.messages) {
    this.messages = this.messages.map((message) => ensureObjectIdHelper(message));
  }
  next();
}

function ensureObjectIdForUpdate(
  this: mongoose.Query<any, any>,
  next: mongoose.CallbackWithoutResultAndOptionalError
) {
  const update = this.getUpdate() as any;
  if (update.pika_agent) update.pika_agent = ensureObjectIdHelper(update.pika_agent);
  if (update.created_by) update.created_by = ensureObjectIdHelper(update.created_by);
  if (update.updated_by) update.updated_by = ensureObjectIdHelper(update.updated_by);
  if (update.functions) {
    update.functions = update.functions.map((func: any) => ensureObjectIdHelper(func));
  }
  if (update.messages) {
    update.messages = update.messages.map((message: any) => ensureObjectIdHelper(message));
  }
  next();
}

function autoPopulate(this: mongoose.Query<any, any>) {
  this.populate('pika_agent created_by updated_by')
    .populate('functions')
    .populate('messages'); // Only need to populate messages at the top level
}

pikaChatSchema.pre('save', ensureObjectIdForSave);
pikaChatSchema.pre('findOneAndUpdate', ensureObjectIdForUpdate);
pikaChatSchema.pre('find', autoPopulate);
pikaChatSchema.pre('findOne', autoPopulate);

const PIKAChat = mongoose.model<IPIKAChatDocument, IPIKAChatModel>('PIKAChat', pikaChatSchema);

export default PIKAChat;