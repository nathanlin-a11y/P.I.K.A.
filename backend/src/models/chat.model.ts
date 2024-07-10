import mongoose, { Schema, Model } from 'mongoose';
import { IChangeHistoryDocument, IMessageDocument, IPIKAChatDocument } from '../interfaces/chat.interface';
import { ensureObjectIdHelper } from '../utils/utils';

// ChangeHistory schema
const changeHistorySchema = new Schema<IChangeHistoryDocument>({
  previous_agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: false },
  updated_agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: false },
  previous_executor: { type: Schema.Types.ObjectId, ref: 'Agent', required: false },
  updated_executor: { type: Schema.Types.ObjectId, ref: 'Agent', required: false },
  previous_functions: [{ type: Schema.Types.ObjectId, ref: 'Task', required: false }],
  updated_functions: [{ type: Schema.Types.ObjectId, ref: 'Task', required: false }],
  previous_task_responses: [{ type: Schema.Types.ObjectId, ref: 'TaskResult', required: false }],
  updated_task_responses: [{ type: Schema.Types.ObjectId, ref: 'TaskResult', required: false }],
  previous_model_id: { type: Schema.Types.ObjectId, ref: 'Model', required: false },
  updated_model_id: { type: Schema.Types.ObjectId, ref: 'Model', required: false },
  changed_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

changeHistorySchema.methods.apiRepresentation = function (this: IChangeHistoryDocument) {
  return {
    id: this._id,
    previous_agent: this.previous_agent ? (this.previous_agent._id || this.previous_agent) : null,
    updated_agent: this.updated_agent ? (this.updated_agent._id || this.updated_agent) : null,
    previous_executor: this.previous_executor ? (this.previous_executor._id || this.previous_executor) : null,
    updated_executor: this.updated_executor ? (this.updated_executor._id || this.updated_executor) : null,
    previous_functions: this.previous_functions.map(func => func._id || func),
    updated_functions: this.updated_functions.map(func => func._id || func),
    previous_task_responses: this.previous_task_responses.map(task => task._id || task),
    updated_task_responses: this.updated_task_responses.map(task => task._id || task),
    previous_model_id: this.previous_model_id || {},
    updated_model_id: this.updated_model_id || {},
    changed_by: this.changed_by ? (this.changed_by._id || this.changed_by) : null,
    timestamp: this.timestamp || null
  };
};

// Message schema
const messageSchema = new Schema<IMessageDocument>({
  content: { type: String, required: true, description: "Content of the message" },
  role: { type: String, enum: ["user", "assistant", "system", "tool"], default: "user", description: "Role of the message" },
  generated_by: { type: String, enum: ["user", "llm", "tool"], default: "user", description: "Source that generated the message" },
  step: { type: String, default: "", description: "Process that is creating this message, usually the task_name or tool_name" },
  assistant_name: { type: String, default: "", description: "Name of the assistant" },
  context: { type: Schema.Types.Mixed, default: null, description: "Context of the message" },
  type: { type: String, default: "text", description: "Type of the message" },
  request_type: { type: String, default: null, description: "Request type of the message, if any. Can be 'approval', 'confirmation', etc." },
  created_by: { type: Schema.Types.ObjectId, ref: 'User', description: "User ID used to call the endpoint" },
  task_responses: [{ type: Schema.Types.ObjectId, ref: 'TaskResult' }],
}, { timestamps: true });

messageSchema.methods.apiRepresentation = function (this: IMessageDocument) {
  return {
    id: this._id,
    content: this.content || null,
    role: this.role || "user",
    generated_by: this.generated_by || "user",
    step: this.step || "",
    assistant_name: this.assistant_name || "",
    context: this.context || null,
    type: this.type || "text",
    request_type: this.request_type || null,
    created_by: this.created_by ? (this.created_by._id || this.created_by) : null,
    created_at: this.createdAt || null,
    updated_at: this.updatedAt || null,
    task_responses: this.task_responses || []
  };
};

// PIKAChat schema
const pikaChatSchema = new Schema<IPIKAChatDocument>({
  name: { type: String, default: "New Chat", description: "Name of the chat" },
  messages: [{ type: messageSchema, required: true, default: [], description: "List of messages in the chat conversation" }],
  changeHistory: [{ type: changeHistorySchema, default: [], description: "List of changes in the chat conversation" }],
  pika_agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: true, description: "The PIKA agent object" },
  functions: [{ type: Schema.Types.ObjectId, ref: 'Task', default: [], description: "List of functions to be registered with the agent" }],
  executor: { type: Schema.Types.ObjectId, ref: 'Agent', required: true, description: "The executor agent object" },
  model_id: { type: Schema.Types.ObjectId, ref: 'Model', description: "The configuration for the LLM agent"},
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

pikaChatSchema.methods.apiRepresentation = function (this: IPIKAChatDocument) {
  return {
    id: this._id,
    messages: this.messages.map(message => message.apiRepresentation()),
    changeHistory: this.changeHistory.map(change => change.apiRepresentation()),
    pika_agent: this.pika_agent ? (this.pika_agent._id || this.pika_agent) : null,
    functions: this.functions.map(func => func._id || func),
    executor: this.executor ? (this.executor._id || this.executor) : null,
    model_id: this.model_id || {},
    created_by: this.created_by ? (this.created_by._id || this.created_by) : null,
    updated_by: this.updated_by ? (this.updated_by._id || this.updated_by) : null,
    created_at: this.createdAt || null,
    updated_at: this.updatedAt || null
  };
};
function ensureObjectIdForSave(this: IPIKAChatDocument, next: mongoose.CallbackWithoutResultAndOptionalError) {
  console.log('Before conversion:', this.model_id);
  if (this.pika_agent) this.pika_agent = ensureObjectIdHelper(this.pika_agent);
  if (this.executor) this.executor = ensureObjectIdHelper(this.executor);
  if (this.created_by) this.created_by = ensureObjectIdHelper(this.created_by);
  if (this.updated_by) this.updated_by = ensureObjectIdHelper(this.updated_by);
  if (this.model_id) this.model_id = ensureObjectIdHelper(this.model_id);

  if (this.functions) {
    this.functions = this.functions.map(func => ensureObjectIdHelper(func));
  }

  next();
}

function ensureObjectIdForUpdate(this: mongoose.Query<any, any>, next: mongoose.CallbackWithoutResultAndOptionalError) {
  const update = this.getUpdate() as any;
  update.pika_agent = ensureObjectIdHelper(update.pika_agent);
  update.executor = ensureObjectIdHelper(update.executor);
  update.created_by = ensureObjectIdHelper(update.created_by);
  update.updated_by = ensureObjectIdHelper(update.updated_by);
  update.model_id = ensureObjectIdHelper(update.model_id);

  if (update.functions) {
    update.functions = update.functions.map((func: any) => ensureObjectIdHelper(func));
  }

  next();
}

function autoPopulate(this: mongoose.Query<any, any>) {
  this.populate('pika_agent executor created_by updated_by model_id')
    .populate({
      path: 'functions',
      model: 'Task'
    });
}

pikaChatSchema.pre('save', ensureObjectIdForSave);
pikaChatSchema.pre('findOneAndUpdate', ensureObjectIdForUpdate);
pikaChatSchema.pre('find', autoPopulate);
pikaChatSchema.pre('findOne', autoPopulate);

const PIKAChat = mongoose.model<IPIKAChatDocument, Model<IPIKAChatDocument>>('PIKAChat', pikaChatSchema);

export default PIKAChat;