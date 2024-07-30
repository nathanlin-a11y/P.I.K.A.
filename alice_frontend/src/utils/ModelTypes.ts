import { User, convertToUser } from "./UserTypes";
import { LlmProvider } from "./ApiTypes";

export interface PIKAModel {
    _id?: string;
    short_name: string;
    model_name: string;
    model_format?: string;
    ctx_size?: number;
    model_type: 'instruct' | 'chat' | 'vision';
    deployment: 'local' | 'remote';
    api_name: LlmProvider;
    temperature?: number;
    seed?: number | null;
    use_cache?: boolean;
    created_by?: User;
    updated_by?: User;
    createdAt?: Date;
    updatedAt?: Date;
}

export const convertToPIKAModel = (data: any): PIKAModel => {
    return {
        _id: data?._id || undefined,
        short_name: data?.short_name || '',
        model_name: data?.model_name || '',
        model_format: data?.model_format || undefined,
        ctx_size: data?.ctx_size || undefined,
        model_type: data?.model_type || 'chat',
        deployment: data?.deployment || 'local',
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

export interface ModelComponentProps {
  items: PIKAModel[] | null;
  item: PIKAModel | null;
  onChange: (newItem: Partial<PIKAModel>) => void;
  mode: 'create' | 'view' | 'edit';
  handleSave: () => Promise<void>;
  isInteractable?: boolean;
  onView?: (model: PIKAModel) => void;
  onInteraction?: (model: PIKAModel) => void;
  showHeaders?: boolean;
}

export const getDefaultModelForm = (): Partial<PIKAModel> => ({
    short_name: '',
    model_name: '',
    model_format: '',
    ctx_size: 0,
    model_type: 'chat',
    deployment: 'remote',
    api_name: LlmProvider.OPENAI,
    temperature: 0.7,
    use_cache: true
});