import mongoose, { Schema } from 'mongoose';
import { IChangeHistoryDocument, IPIKAChatDocument, IPIKAChatModel } from '../interfaces/chat.interface';
import { getObjectId } from '../utils/utils';

// ChangeHistory schema
const changeHistorySchema = new Schema<IChangeHistoryDocument>({
  previous_agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: false },
  updated_agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: false },
  previous_agent_tools: [{ type: Schema.Types.ObjectId, ref: 'Task', required: false }],
  updated_agent_tools: [{ type: Schema.Types.ObjectId, ref: 'Task', required: false }],
  changed_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

changeHistorySchema.methods.apiRepresentation = function (this: IChangeHistoryDocument) {
  return {
    id: this._id,
    previous_agent: this.previous_agent ? (this.previous_agent._id || this.previous_agent) : null,
    updated_agent: this.updated_agent ? (this.updated_agent._id || this.updated_agent) : null,
    previous_agent_tools: this.previous_agent_tools.map(func => func._id || func),
    updated_agent_tools: this.updated_agent_tools.map(func => func._id || func),
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
  agent_tools: [{ type: Schema.Types.ObjectId, ref: 'Task', default: [], description: "List of tools to be registered with the agent" }],
  retrieval_tools: [{ type: Schema.Types.ObjectId, ref: 'Task', default: [], description: "List of tools with access to the data cluster" }],
  data_cluster: { type: Schema.Types.ObjectId, ref: 'DataCluster', required: false, description: "Data cluster for the chat" },
  user_checkpoints: { type: Map, of: [{ type: Schema.Types.ObjectId, ref: 'UserCheckpoint' }], default: {}, description: "Map of user checkpoints" },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

pikaChatSchema.methods.apiRepresentation = function (this: IPIKAChatDocument) {
  return {
    id: this._id,
    messages: this.messages.map((message) => message._id || message),
    changeHistory: this.changeHistory.map((change) => change.apiRepresentation()),
    pika_agent: this.pika_agent ? (this.pika_agent._id || this.pika_agent) : null,
    agent_tools: this.agent_tools.map((func) => func._id || func),
    retrieval_tools: this.retrieval_tools.map((func) => func._id || func),
    data_cluster: this.data_cluster ? (this.data_cluster._id || this.data_cluster) : null,
    user_checkpoints: this.user_checkpoints || {},
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
  if (this.pika_agent) this.pika_agent = getObjectId(this.pika_agent);
  if (this.created_by) this.created_by = getObjectId(this.created_by);
  if (this.updated_by) this.updated_by = getObjectId(this.updated_by);
  if (this.agent_tools) {
    this.agent_tools = this.agent_tools.map((func) => getObjectId(func));
  }
  if (this.retrieval_tools) {
    this.retrieval_tools = this.retrieval_tools.map((func) => getObjectId(func));
  }
  if (this.data_cluster) this.data_cluster = getObjectId(this.data_cluster);
  if (this.messages) {
    this.messages = this.messages.map((message) => getObjectId(message));
  }
  if (this.user_checkpoints && Object.keys(this.user_checkpoints).length > 0) {
    const newCheckpoints: { [key: string]: any } = {};
    for (const key in this.user_checkpoints) {
      newCheckpoints[key] = getObjectId(this.user_checkpoints[key]);
    }
    this.user_checkpoints = newCheckpoints;
  }
  next();
}

function ensureObjectIdForUpdate(
  this: mongoose.Query<any, any>,
  next: mongoose.CallbackWithoutResultAndOptionalError
) {
  const update = this.getUpdate() as any;
  if (update.pika_agent) update.pika_agent = getObjectId(update.pika_agent);
  if (update.created_by) update.created_by = getObjectId(update.created_by);
  if (update.updated_by) update.updated_by = getObjectId(update.updated_by);
  if (update.agent_tools) {
    update.agent_tools = update.agent_tools.map((func: any) => getObjectId(func));
  }
  if (update.retrieval_tools) {
    update.retrieval_tools = update.retrieval_tools.map((func: any) => getObjectId(func));
  }
  if (update.data_cluster) update.data_cluster = getObjectId(update.data_cluster);
  if (update.messages) {
    update.messages = update.messages.map((message: any) => getObjectId(message));
  }
  if (update.user_checkpoints && Object.keys(update.user_checkpoints).length > 0) {
    const newCheckpoints: { [key: string]: any } = {};
    for (const key in update.user_checkpoints) {
      newCheckpoints[key] = getObjectId(update.user_checkpoints[key]);
    }
    update.user_checkpoints = newCheckpoints;
  }
  next();
}

function autoPopulate(this: mongoose.Query<any, any>) {
  this.populate('pika_agent created_by updated_by')
    .populate('agent_tools')
    .populate('retrieval_tools')
    .populate('data_cluster')
    .populate({
      path: 'user_checkpoints.$*',
      model: 'UserCheckpoint'
    })
    .populate('messages'); // Only need to populate messages at the top level
}

pikaChatSchema.pre('save', ensureObjectIdForSave);
pikaChatSchema.pre('findOneAndUpdate', ensureObjectIdForUpdate);
pikaChatSchema.pre('find', autoPopulate);
pikaChatSchema.pre('findOne', autoPopulate);

const PIKAChat = mongoose.model<IPIKAChatDocument, IPIKAChatModel>('PIKAChat', pikaChatSchema);

export default PIKAChat;