import mongoose, { Schema } from 'mongoose';
import { IChangeHistoryDocument, IMessageDocument, IPIKAChatDocument, IPIKAChatModel } from '../interfaces/chat.interface';
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

// Message schema
const messageSchema = new Schema<IMessageDocument>({
  content: { type: String, required: true, description: "Content of the message" },
  role: { type: String, enum: ["user", "assistant", "system", "tool"], default: "user", description: "Role of the message" },
  generated_by: { type: String, enum: ["user", "llm", "tool"], default: "user", description: "Source that generated the message" },
  step: { type: String, default: "", description: "Process that is creating this message, usually the task_name or tool_name" },
  assistant_name: { type: String, default: "", description: "Name of the assistant" },
  context: { type: Schema.Types.Mixed, default: null, description: "Context of the message" },
  type: { type: String, default: "text", description: "Type of the message" },
  tool_calls: { type: Schema.Types.Mixed, default: [], description: "List of tool calls in the message" },
  tool_call_id: { type: String, default: null, description: "ID of the tool call, if any" },
  request_type: { type: String, default: null, description: "Request type of the message, if any. Can be 'approval', 'confirmation', etc." },
  created_by: { type: Schema.Types.ObjectId, ref: 'User', description: "User ID used to call the endpoint" },
  references: [{ type: Schema.Types.ObjectId, ref: 'FileReference' }],
  task_responses: [{ type: Schema.Types.ObjectId, ref: 'TaskResponse' }]
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
    tool_calls: this.tool_calls || [],
    type: this.type || "text",
    tool_call_id: this.tool_call_id || null,
    request_type: this.request_type || null,
    created_by: this.created_by ? (this.created_by._id || this.created_by) : null,
    createdAt: this.createdAt || null,
    updatedAt: this.updatedAt || null,
    references: this.references || []
  };
};

// PIKAChat schema
const pikaChatSchema = new Schema<IPIKAChatDocument, IPIKAChatModel>({
  name: { type: String, default: "New Chat", description: "Name of the chat" },
  messages: [{ type: messageSchema, required: true, default: [], description: "List of messages in the chat conversation" }],
  changeHistory: [{ type: changeHistorySchema, default: [], description: "List of changes in the chat conversation" }],
  pika_agent: { type: Schema.Types.ObjectId, ref: 'Agent', required: true, description: "The PIKA agent object" },
  functions: [{ type: Schema.Types.ObjectId, ref: 'Task', default: [], description: "List of functions to be registered with the agent" }],
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
    created_by: this.created_by ? (this.created_by._id || this.created_by) : null,
    updated_by: this.updated_by ? (this.updated_by._id || this.updated_by) : null,
    createdAt: this.createdAt || null,
    updatedAt: this.updatedAt || null
  };
};

function ensureObjectIdForSave(this: IPIKAChatDocument, next: mongoose.CallbackWithoutResultAndOptionalError) {
  if (this.pika_agent) this.pika_agent = ensureObjectIdHelper(this.pika_agent);
  if (this.created_by) this.created_by = ensureObjectIdHelper(this.created_by);
  if (this.updated_by) this.updated_by = ensureObjectIdHelper(this.updated_by);

  if (this.functions) {
    this.functions = this.functions.map(func => ensureObjectIdHelper(func));
  }

  this.messages.forEach(message => {
    if (message.references) {
      message.references = message.references.map(reference => ensureObjectIdHelper(reference))
    }
    message.created_by = ensureObjectIdHelper(message.created_by)
  });

  next();
}

function ensureObjectIdForUpdate(this: mongoose.Query<any, any>, next: mongoose.CallbackWithoutResultAndOptionalError) {
  const update = this.getUpdate() as any;
  update.pika_agent = ensureObjectIdHelper(update.pika_agent);
  update.created_by = ensureObjectIdHelper(update.created_by);
  update.updated_by = ensureObjectIdHelper(update.updated_by);

  if (update.functions) {
    update.functions = update.functions.map((func: any) => ensureObjectIdHelper(func));
  }

  if (update.messages) {
    update.messages.forEach((message: any) => {
      if (message.references) {
        message.references = message.references.map((reference: any) => ensureObjectIdHelper(reference))
      }
      message.created_by = ensureObjectIdHelper(message.created_by)
    });
  }

  next();
}

function autoPopulate(this: mongoose.Query<any, any>) {
  this.populate('pika_agent created_by updated_by')
    .populate({
      path: 'functions',
      model: 'Task'
    })
    .populate({
      path: 'messages.references',
      model: 'FileReference'
    })
    .populate({
      path: 'messages.created_by',
      model: 'User'
    })
}

pikaChatSchema.pre('save', ensureObjectIdForSave);
pikaChatSchema.pre('findOneAndUpdate', ensureObjectIdForUpdate);
pikaChatSchema.pre('find', autoPopulate);
pikaChatSchema.pre('findOne', autoPopulate);

const PIKAChat = mongoose.model<IPIKAChatDocument, IPIKAChatModel>('PIKAChat', pikaChatSchema);

export default PIKAChat;