import { ApiName } from "./ApiTypes";
import { BaseDatabaseObject, convertToBaseDatabaseObject, EnhancedComponentProps } from "./CollectionTypes";

export enum ModelType {
    INSTRUCT = 'instruct',
    CHAT = 'chat',
    VISION = 'vision',
    STT = 'stt',
    TTS = 'tts',
    EMBEDDINGS = 'embeddings',
    IMG_GEN = 'img_gen',
}
export interface PIKAModel extends BaseDatabaseObject { 
    short_name: string;
    model_name: string;
    model_format?: string;
    ctx_size?: number;
    model_type: ModelType;
    api_name: ApiName;
    temperature?: number;
    seed?: number | null;
    use_cache?: boolean;
}

export const convertToPIKAModel = (data: any): PIKAModel => {
    return {
        ...convertToBaseDatabaseObject(data),
        short_name: data?.short_name || '',
        model_name: data?.model_name || '',
        model_format: data?.model_format || undefined,
        ctx_size: data?.ctx_size || undefined,
        model_type: data?.model_type || 'chat',
        api_name: data?.api_name || 'lm_studio',
        temperature: data?.temperature || undefined,
        seed: data?.seed || null,
        use_cache: data?.use_cache || false,
    };
};

export interface ModelComponentProps extends EnhancedComponentProps<PIKAModel> {
    
}

export const getDefaultModelForm = (): Partial<PIKAModel> => ({
    short_name: '',
    model_name: '',
    model_format: '',
    ctx_size: 0,
    model_type: undefined,
    api_name: undefined,
    temperature: 0.7,
    use_cache: true
});