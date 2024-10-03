import React, { useState, useCallback, useEffect } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    TextField,
} from '@mui/material';
import { ApiComponentProps, API, ApiType, ApiName, getDefaultApiForm } from '../../../../types/ApiTypes';
import { API_TYPE_CONFIGS, LLM_PROVIDERS } from '../../../../utils/ApiUtils';
import EnhancedSelect from '../../common/enhanced_select/EnhancedSelect';
import EnhancedModel from '../../model/model/EnhancedModel';
import { PIKAModel } from '../../../../types/ModelTypes';
import { useApi } from '../../../../contexts/ApiContext';
import GenericFlexibleView from '../../common/enhanced_component/FlexibleView';
import Logger from '../../../../utils/Logger';

const getLlmProviderBaseUrl = (apiName: ApiName): string => {
    for (const provider of Object.values(LLM_PROVIDERS)) {
        if (provider.api_name.includes(apiName)) {
            return provider.baseUrl;
        }
    }
    return '';
};

const ApiFlexibleView: React.FC<ApiComponentProps> = ({
    item,
    onChange,
    mode,
    handleSave,
}) => {
    const { fetchItem } = useApi();
    const [form, setForm] = useState<Partial<API>>(() => item || getDefaultApiForm());
    const [availableApiNames, setAvailableApiNames] = useState<ApiName[]>([]);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    const isEditMode = mode === 'edit' || mode === 'create';
    const isCreateMode = mode === 'create';

    useEffect(() => {
        if (form.api_type) {
            updateAvailableApiNames(form.api_type);
        }
    }, [form.api_type]);

    useEffect(() => {
        if (form.api_name) {
            const baseUrl = getLlmProviderBaseUrl(form.api_name);
            if (baseUrl) {
                setForm(prevForm => ({
                    ...prevForm,
                    api_config: {
                        ...prevForm.api_config,
                        base_url: baseUrl,
                    },
                }));
            }
        }
    }, [form.api_name]);

    const updateAvailableApiNames = useCallback((apiType: ApiType | undefined) => {
        Logger.info('updateAvailableApiNames', apiType);
        if (apiType && API_TYPE_CONFIGS[apiType]) {
            setAvailableApiNames(API_TYPE_CONFIGS[apiType].api_name);
        } else {
            setAvailableApiNames([]);
        }
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    }, []);

    const handleApiNameChange = useCallback((newApiName: ApiName) => {
        setForm(prevForm => ({
            ...prevForm,
            api_name: newApiName,
            api_config: {
                ...prevForm.api_config,
                base_url: getLlmProviderBaseUrl(newApiName),
                api_key: '',
            },
        }));
    }, []);

    const handleApiTypeChange = useCallback((newApiType: ApiType) => {
        const config = API_TYPE_CONFIGS[newApiType];
        updateAvailableApiNames(newApiType);
        setForm(prevForm => ({
            ...prevForm,
            api_type: newApiType,
            api_config: config.apiConfig,
            api_name: config.api_name[0],
        }));
    }, [updateAvailableApiNames]);

    const handleApiConfigChange = useCallback((key: string, value: string) => {
        setForm(prevForm => ({
            ...prevForm,
            api_config: { ...prevForm.api_config, [key]: value }
        }));
    }, []);

    const handleDefaultModelChange = useCallback(async (selectedIds: string[]) => {
        if (selectedIds.length > 0) {
            const model = await fetchItem('models', selectedIds[0]) as PIKAModel;
            setForm(prevForm => ({ ...prevForm, default_model: model }));
        } else {
            setForm(prevForm => ({ ...prevForm, default_model: undefined }));
        }
    }, [fetchItem]);

    const handleAccordionToggle = useCallback((accordion: string | null) => {
        setActiveAccordion(prevAccordion => prevAccordion === accordion ? null : accordion);
    }, []);

    const handleLocalSave = useCallback(() => {
        onChange(form);
        handleSave();
    }, [form, onChange, handleSave]);

    const title = mode === 'create' ? 'Create New API' : mode === 'edit' ? 'Edit API' : 'API Details';
    const saveButtonText = form._id ? 'Update API' : 'Create API';

    return (
        <GenericFlexibleView
            elementType='API'
            title={title}
            onSave={handleLocalSave}
            saveButtonText={saveButtonText}
            isEditMode={isEditMode}
        >
            {isCreateMode && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>API Type</InputLabel>
                    <Select
                        value={form.api_type || ''}
                        onChange={(e) => handleApiTypeChange(e.target.value as ApiType)}
                    >
                        {Object.values(ApiType).map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {form.api_name && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>API Name</InputLabel>
                    <Select
                        value={form.api_name || ''}
                        onChange={(e) => handleApiNameChange(e.target.value as ApiName)}
                        disabled={!isEditMode}
                    >
                        {availableApiNames.map((name) => (
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            <TextField
                fullWidth
                name="name"
                label="API Display Name"
                value={form.name || ''}
                onChange={handleInputChange}
                margin="normal"
                disabled={!isEditMode}
            />

            {form.api_config && Object.entries(form.api_config).map(([key, value]) => (
                <TextField
                    key={key}
                    fullWidth
                    label={key}
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleApiConfigChange(key, e.target.value)}
                    margin="normal"
                    disabled={!isEditMode}
                />
            ))}

            {form.api_type === ApiType.LLM_MODEL && (
                <EnhancedSelect<PIKAModel>
                    componentType="models"
                    EnhancedComponent={EnhancedModel}
                    selectedItems={form.default_model ? [form.default_model] : []}
                    onSelect={handleDefaultModelChange}
                    isInteractable={isEditMode}
                    label="Select Default Model"
                    activeAccordion={activeAccordion}
                    onAccordionToggle={handleAccordionToggle}
                    accordionEntityName="default-model"
                    showCreateButton={true}
                />
            )}

            <FormControl fullWidth margin="normal">
                <InputLabel>Is Active</InputLabel>
                <Switch
                    checked={form.is_active || false}
                    onChange={(e) => onChange({ ...form, is_active: e.target.checked })}
                    disabled={!isEditMode}
                />
            </FormControl>

        </GenericFlexibleView>
    );
};

export default ApiFlexibleView;