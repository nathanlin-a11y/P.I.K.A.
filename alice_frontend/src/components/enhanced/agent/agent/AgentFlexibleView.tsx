import React, { useState, useEffect } from 'react';
import {
    TextField,
    FormControlLabel,
    Switch,
    Dialog
} from '@mui/material';
import { AgentComponentProps, PIKAAgent, getDefaultAgentForm } from '../../../../utils/AgentTypes';
import { Prompt } from '../../../../utils/PromptTypes';
import { PIKAModel } from '../../../../utils/ModelTypes';
import EnhancedSelect from '../../common/enhanced_select/EnhancedSelect';
import EnhancedModel from '../../model/model/EnhancedModel';
import EnhancedPrompt from '../../prompt/prompt/EnhancedPrompt';
import { useApi } from '../../../../context/ApiContext';
import GenericFlexibleView from '../../common/enhanced_component/FlexibleView';

const AgentFlexibleView: React.FC<AgentComponentProps> = ({
    item,
    onChange,
    mode,
    handleSave
}) => {
    const { fetchItem } = useApi();
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<PIKAAgent>>(getDefaultAgentForm());
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(null);

    useEffect(() => {
        if (item) {
            setForm({ ...getDefaultAgentForm(), ...item });
        }
    }, [item]);

    const isEditMode = mode === 'edit' || mode === 'create';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange({ ...form, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        onChange({ ...form, [name]: checked });
    };

    const handleModelChange = async (selectedIds: string[]) => {
        if (selectedIds.length > 0) {
            const model = await fetchItem('models', selectedIds[0]) as PIKAModel;
            onChange({ ...form, model_id: model });
        } else {
            onChange({ ...form, model_id: null });
        }
    };

    const handlePromptChange = async (selectedIds: string[]) => {
        if (selectedIds.length > 0) {
            const prompt = await fetchItem('prompts', selectedIds[0]) as Prompt;
            onChange({ ...form, system_message: prompt });
        } else {
            onChange({ ...form, system_message: undefined });
        }
    };

    const handleAccordionToggle = (accordion: string | null) => {
        setActiveAccordion(prevAccordion => prevAccordion === accordion ? null : accordion);
    };

    const handleViewDetails = (type: 'model' | 'prompt', itemId: string) => {
        let content;
        switch (type) {
            case 'model':
                content = <EnhancedModel mode="card" itemId={itemId} fetchAll={false} />;
                break;
            case 'prompt':
                content = <EnhancedPrompt mode="card" itemId={itemId} fetchAll={false} />;
                break;
        }
        setDialogContent(content);
        setDialogOpen(true);
    };

    const title = mode === 'create' ? 'Create New Agent' : mode === 'edit' ? 'Edit Agent' : 'Agent Details';
    const saveButtonText = form._id ? 'Update Agent' : 'Create Agent';

    return (
        <GenericFlexibleView
            title={title}
            onSave={handleSave}
            saveButtonText={saveButtonText}
            isEditMode={isEditMode}
        >
            <TextField
                fullWidth
                name="name"
                label="Name"
                value={form.name || ''}
                onChange={handleInputChange}
                margin="normal"
                disabled={!isEditMode}
            />

            <EnhancedSelect<Prompt>
                componentType="prompts"
                EnhancedComponent={EnhancedPrompt}
                selectedItems={form.system_message ? [form.system_message] : []}
                onSelect={handlePromptChange}
                isInteractable={isEditMode}
                label="Select System Message"
                activeAccordion={activeAccordion}
                onAccordionToggle={handleAccordionToggle}
                onView={(id) => handleViewDetails("prompt", id)}
                accordionEntityName="system-message"
            />

            <EnhancedSelect<PIKAModel>
                componentType="models"
                EnhancedComponent={EnhancedModel}
                selectedItems={form.model_id ? [form.model_id] : []}
                onSelect={handleModelChange}
                isInteractable={isEditMode}
                label="Select Model"
                activeAccordion={activeAccordion}
                onAccordionToggle={handleAccordionToggle}
                onView={(id) => handleViewDetails("model", id)}
                accordionEntityName="model"
            />

            <FormControlLabel
                control={
                    <Switch
                        name="has_code_exec"
                        checked={form.has_code_exec || false}
                        onChange={handleCheckboxChange}
                        disabled={!isEditMode}
                    />
                }
                label="Execute Code"
            />

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                {dialogContent}
            </Dialog>
        </GenericFlexibleView>
    );
};

export default AgentFlexibleView;