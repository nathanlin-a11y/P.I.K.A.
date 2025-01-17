import { CollectionName, CollectionPopulatedType, CollectionType } from "../types/CollectionTypes";
import { convertToPIKAAgent } from "../types/AgentTypes";
import { convertToAPI } from "../types/ApiTypes";
import { convertToPIKAChat, convertToPopulatedPIKAChat } from "../types/ChatTypes";
import { convertToDataCluster, convertToPopulatedDataCluster } from "../types/DataClusterTypes";
import { convertToEmbeddingChunk } from "../types/EmbeddingChunkTypes";
import { convertToFileReference, convertToPopulatedFileReference } from "../types/FileTypes";
import { convertToMessageType, convertToPopulatedMessage } from "../types/MessageTypes";
import { convertToPIKAModel } from "../types/ModelTypes";
import { convertToParameterDefinition } from "../types/ParameterTypes";
import { convertToPrompt } from "../types/PromptTypes";
import { convertToPopulatedTaskResponse, convertToTaskResponse } from "../types/TaskResponseTypes";
import { convertToPIKATask, convertToPopulatedTask } from "../types/TaskTypes";
import { convertToUserCheckpoint } from "../types/UserCheckpointTypes";
import { convertToPopulatedUserInteraction, convertToUserInteraction } from "../types/UserInteractionTypes";
import { convertToUser } from "../types/UserTypes";
import { convertToEntityReference, convertToPopulatedEntityReference } from "../types/EntityReferenceTypes";
import { convertToPopulatedToolCall, convertToToolCall } from "../types/ToolCallTypes";
import { convertToCodeExecution, convertToPopulatedCodeExecution } from "../types/CodeExecutionTypes";
import { convertToAPIConfig } from "../types/ApiConfigTypes";
import { convertToChatThread, convertToPopulatedChatThread } from "../types/ChatThreadTypes";

export const converters: { [K in CollectionName]: (data: any) => CollectionType[K] } = {
    agents: convertToPIKAAgent,
    chats: convertToPIKAChat,
    chatthreads: convertToChatThread,
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
export const populatedConverters: { [K in CollectionName]: (data: any) => CollectionPopulatedType[K] } = {
    // Use populated chat converter
    chats: convertToPopulatedPIKAChat,
    chatthreads: convertToPopulatedChatThread,
    tasks: convertToPopulatedTask,
    taskresults: convertToPopulatedTaskResponse,
    files: convertToPopulatedFileReference,
    messages: convertToPopulatedMessage,
    entityreferences: convertToPopulatedEntityReference,
    userinteractions: convertToPopulatedUserInteraction,
    dataclusters: convertToPopulatedDataCluster,
    toolcalls: convertToPopulatedToolCall,
    codeexecutions: convertToPopulatedCodeExecution,
    
    // Reuse existing converters for all other types
    agents: converters.agents,
    models: converters.models,
    prompts: converters.prompts,
    users: converters.users,
    parameters: converters.parameters,
    apis: converters.apis,
    usercheckpoints: converters.usercheckpoints,
    embeddingchunks: converters.embeddingchunks,
    apiconfigs: converters.apiconfigs,
};