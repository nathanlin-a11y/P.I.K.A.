import { CollectionName, CollectionType } from "../types/CollectionTypes";
import { convertToPIKAAgent } from "../types/AgentTypes";
import { convertToAPI } from "../types/ApiTypes";
import { convertToPIKAChat } from "../types/ChatTypes";
import { convertToDataCluster } from "../types/DataClusterTypes";
import { convertToEmbeddingChunk } from "../types/EmbeddingChunkTypes";
import { convertToFileReference } from "../types/FileTypes";
import { convertToMessageType } from "../types/MessageTypes";
import { convertToPIKAModel } from "../types/ModelTypes";
import { convertToParameterDefinition } from "../types/ParameterTypes";
import { convertToPrompt } from "../types/PromptTypes";
import { convertToTaskResponse } from "../types/TaskResponseTypes";
import { convertToPIKATask } from "../types/TaskTypes";
import { convertToUserCheckpoint } from "../types/UserCheckpointTypes";
import { convertToUserInteraction } from "../types/UserInteractionTypes";
import { convertToUser } from "../types/UserTypes";
import { convertToEntityReference } from "../types/EntityReferenceTypes";
import { convertToToolCall } from "../types/ToolCallTypes";
import { convertToCodeExecution } from "../types/CodeExecutionTypes";
import { convertToAPIConfig } from "../types/ApiConfigTypes";

export const converters: { [K in CollectionName]: (data: any) => CollectionType[K] } = {
    agents: convertToPIKAAgent,
    chats: convertToPIKAChat,
    models: convertToPIKAModel,
    tasks: convertToPIKATask,
    prompts: convertToPrompt,
    taskresults: convertToTaskResponse,
    users: convertToUser,
    parameters: convertToParameterDefinition,
    apis: convertToAPI,
    files: convertToFileReference,
    messages: convertToMessageType,
    entityreferences: convertToEntityReference,
    userinteractions: convertToUserInteraction,
    usercheckpoints: convertToUserCheckpoint,
    dataclusters: convertToDataCluster,
    embeddingchunks: convertToEmbeddingChunk,
    toolcalls: convertToToolCall,
    codeexecutions: convertToCodeExecution,
    apiconfigs: convertToAPIConfig,
};