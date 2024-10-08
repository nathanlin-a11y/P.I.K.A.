# APIs

This document provides an overview of the different types of APIs used, their purposes, and how they relate to various model types.

## API Types

In the PIKA system, APIs are categorized into two main groups:

1. Model APIs
2. Non-Model APIs

### Model APIs

Model APIs are primarily used for interaction with AI models. They are closely tied to the `ModelType` enum, which defines the capabilities of these models.

```typescript
export enum ModelType {
    INSTRUCT = 'instruct',
    CHAT = 'chat',
    VISION = 'vision',
    STT = 'stt',
    TTS = 'tts',
    EMBEDDINGS = 'embeddings',
    IMG_GEN = 'img_gen',
}
```

The following API types are considered Model APIs:

- `LLM_MODEL`: For text generation models (INSTRUCT and CHAT)
- `IMG_VISION`: For image understanding models (VISION)
- `IMG_GENERATION`: For image creation models (IMG_GEN)
- `SPEECH_TO_TEXT`: For audio transcription models (STT)
- `TEXT_TO_SPEECH`: For text-to-speech models (TTS)
- `EMBEDDINGS`: For text embedding models (EMBEDDINGS)

### Non-Model APIs

Non-Model APIs are used for various other functionalities that don't directly involve AI model inference. These include:

- `GOOGLE_SEARCH`: For performing web searches
- `REDDIT_SEARCH`: For searching Reddit content
- `WIKIPEDIA_SEARCH`: For searching Wikipedia articles
- `EXA_SEARCH`: For using the Exa search engine
- `ARXIV_SEARCH`: For searching academic papers on arXiv

## API Providers

The system supports multiple API providers, each offering different sets of functionalities:

```typescript
export enum ApiName {
    OPENAI = 'openai_llm',
    OPENAI_VISION = 'openai_vision',
    OPENAI_IMG_GENERATION = 'openai_img_gen',
    OPENAI_EMBEDDINGS = 'openai_embeddings',
    OPENAI_TTS = 'openai_tts',
    OPENAI_STT = 'openai_stt',
    OPENAI_ASTT = 'openai_adv_stt',
    AZURE = 'azure',
    GEMINI = 'gemini_llm',
    GEMINI_VISION = 'gemini_vision',
    MISTRAL = 'mistral_llm',
    MISTRAL_VISION = 'mistral_vision',
    MISTRAL_EMBEDDINGS = 'mistral_embeddings',
    GEMINI_STT = 'gemini_stt',
    GEMINI_EMBEDDINGS = 'gemini_embeddings',
    COHERE = 'cohere_llm',
    GROQ = 'groq_llm',
    GROQ_VISION = 'groq_vision',
    GROQ_TTS = 'groq_tts',
    META = 'meta_llm',
    META_VISION = 'meta_vision',
    ANTHROPIC = 'anthropic_llm',
    ANTHROPIC_VISION = 'anthropic_vision',
    LM_STUDIO = 'lm-studio_llm',
    LM_STUDIO_VISION = 'lm-studio_vision',
    CUSTOM = 'Custom',
    // Non-model API providers
    GOOGLE_SEARCH = 'google_search',
    REDDIT_SEARCH = 'reddit_search',
    WIKIPEDIA_SEARCH = 'wikipedia_search',
    EXA_SEARCH = 'exa_search',
    ARXIV_SEARCH = 'arxiv_search',
}
```

## API Configuration

Each API in the system is represented by the `API` interface:

```typescript
export interface API extends BaseDataseObject {
    _id?: string;
    api_type: ApiType;
    api_name: ApiName;
    name?: string;
    is_active: boolean;
    health_status: 'healthy' | 'unhealthy' | 'unknown';
    default_model?: PIKAModel;
    api_config: { [key: string]: string };
}
```

Key points:
- `api_type`: Determines the category of API (e.g., LLM_MODEL, IMG_VISION)
- `api_name`: Specifies the provider (e.g., OPENAI, GEMINI)
- `default_model`: For Model APIs, this specifies the default model to use
- `api_config`: Contains provider-specific configuration (e.g., API keys, base URLs)

## Relationship with Agents

In the PIKA system, [Agents](/knowledgebase/agent) can be configured to use specific APIs for different model types. This is achieved through the `models` property in the `PIKAAgent` interface:

```typescript
export interface PIKAAgent {
    // ... other properties
    models?: { [key in ModelType]?: PIKAModel };
}
```

This structure allows an agent to use different models (and thus, different APIs) for various tasks:
- A CHAT model for text generation
- A VISION model for image understanding
- An EMBEDDINGS model for text embeddings
- And so on...

## Adding a New API

To add support for a new API:

1. Update the `ApiType` enum if it's a new category of API.
2. Add a new entry to the `ApiName` enum for the provider.
3. Update the frontend components to handle the new API type (see the Frontend README for details).
4. Implement the necessary backend logic to interact with the new API.