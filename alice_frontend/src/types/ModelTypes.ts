import { BaseDataseObject, convertToUser } from "./UserTypes";
import { ApiName } from "./ApiTypes";
import { EnhancedComponentProps } from "./CollectionTypes";

export enum ModelType {
    INSTRUCT = 'instruct',
    CHAT = 'chat',
    VISION = 'vision',
    STT = 'stt',
    TTS = 'tts',
    EMBEDDINGS = 'embeddings',
    IMG_GEN = 'img_gen',
}
export interface PIKAModel extends BaseDataseObject {
    _id?: string;
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
        _id: data?._id || undefined,
        short_name: data?.short_name || '',
        model_name: data?.model_name || '',
        model_format: data?.model_format || undefined,
        ctx_size: data?.ctx_size || undefined,
        model_type: data?.model_type || 'chat',
        api_name: data?.api_name || 'lm-studio',
        temperature: data?.temperature || undefined,
        seed: data?.seed || null,
        use_cache: data?.use_cache || false,
        created_by: data?.created_by ? convertToUser(data.created_by) : undefined,
        updated_by: data?.updated_by ? convertToUser(data.updated_by) : undefined,
        createdAt: data?.createdAt ? new Date(data.createdAt) : undefined,
        updatedAt: data?.updatedAt ? new Date(data.updatedAt) : undefined,
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