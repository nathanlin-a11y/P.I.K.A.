import { CollectionName, CollectionPopulatedType, CollectionType } from "../types/CollectionTypes";
import { convertToPIKAAgent } from "../types/AgentTypes";
import { convertToAPI } from "../types/ApiTypes";
import { convertToPIKAChat, convertToPopulatedPIKAChat } from "../types/ChatTypes";
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
export const populatedConverters: { [K in CollectionName]: (data: any) => CollectionPopulatedType[K] } = {
    // Use populated chat converter
    chats: convertToPopulatedPIKAChat,
    
    // Reuse existing converters for all other types
    agents: converters.agents,
    models: converters.models,
    tasks: converters.tasks,
    prompts: converters.prompts,
    taskresults: converters.taskresults,
    users: converters.users,
    parameters: converters.parameters,
    apis: converters.apis,
    files: converters.files,
    messages: converters.messages,
    entityreferences: converters.entityreferences,
    userinteractions: converters.userinteractions,
    usercheckpoints: converters.usercheckpoints,
    dataclusters: converters.dataclusters,
    embeddingchunks: converters.embeddingchunks,
    toolcalls: converters.toolcalls,
    codeexecutions: converters.codeexecutions,
    apiconfigs: converters.apiconfigs,
};