import React, { useState, useEffect } from 'react';
import {
    TextField,
    Dialog
} from '@mui/material';
import { ChatComponentProps, PIKAChat, getDefaultChatForm } from '../../../../utils/ChatTypes';
import EnhancedSelect from '../../common/enhanced_select/EnhancedSelect';
import EnhancedModel from '../../model/model/EnhancedModel';
import EnhancedAgent from '../../agent/agent/EnhancedAgent';
import EnhancedTask from '../../task/task/EnhancedTask';
import { PIKAAgent } from '../../../../utils/AgentTypes';
import { PIKAModel } from '../../../../utils/ModelTypes';
import { PIKATask } from '../../../../utils/TaskTypes';
import { useApi } from '../../../../context/ApiContext';
import GenericFlexibleView from '../../common/enhanced_component/FlexibleView';

const ChatFlexibleView: React.FC<ChatComponentProps> = ({ 
    item,
    onChange,
    mode,
    handleSave
}) => {
    const { fetchItem } = useApi();
    const [form, setForm] = useState<Partial<PIKAChat>>(getDefaultChatForm());
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(null);

    useEffect(() => {
        if (item) {
            setForm({ ...getDefaultChatForm(), ...item });
        }
    }, [item]);

    const isEditMode = mode === 'edit' || mode === 'create';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange({ ...form, [name]: value });
    };

    const handleModelChange = async (selectedIds: string[]) => {
        if (selectedIds.length > 0) {
            const model = await fetchItem('models', selectedIds[0]) as PIKAModel;
            onChange({ ...form, model_id: model });
        } else {
            onChange({ ...form, model_id: undefined });
        }
    };

    const handleAgentChange = async (selectedIds: string[]) => {
        if (selectedIds.length > 0) {
            const agent = await fetchItem('agents', selectedIds[0]) as PIKAAgent;
            onChange({ ...form, pika_agent: agent });
        } else {
            onChange({ ...form, pika_agent: undefined });
        }
    };

    const handleExecutorChange = async (selectedIds: string[]) => {
        if (selectedIds.length > 0) {
            const agent = await fetchItem('agents', selectedIds[0]) as PIKAAgent;
            onChange({ ...form, executor: agent });
        } else {
            onChange({ ...form, executor: undefined });
        }
    };

    const handleFunctionsChange = async (selectedIds: string[]) => {
        const functions = await Promise.all(selectedIds.map(id => fetchItem('tasks', id) as Promise<PIKATask>));
        onChange({ ...form, functions });
    };

    const handleAccordionToggle = (accordion: string | null) => {
        setActiveAccordion(prevAccordion => prevAccordion === accordion ? null : accordion);
    };

    const handleViewDetails = (type: 'agent' | 'executor' | 'model' | 'task', itemId: string) => {
        let content;
        switch (type) {
            case 'agent':
            case 'executor':
                content = <EnhancedAgent mode="card" itemId={itemId} fetchAll={false} />;
                break;
            case 'model':
                content = <EnhancedModel mode="card" itemId={itemId} fetchAll={false} />;
                break;
            case 'task':
                content = <EnhancedTask mode="card" itemId={itemId} fetchAll={false} />;
                break;
        }
        setDialogContent(content);
        setDialogOpen(true);
    };

    const title = mode === 'create' ? 'Create New Chat' : mode === 'edit' ? 'Edit Chat' : 'Chat Details';
    const saveButtonText = form._id ? 'Update Chat' : 'Create Chat';

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
                label="Chat Name"
                value={form.name || ''}
                onChange={handleInputChange}
                disabled={!isEditMode}
            />
            <EnhancedSelect<PIKAAgent>
                componentType="agents"
                EnhancedComponent={EnhancedAgent}
                selectedItems={form.pika_agent ? [form.pika_agent] : []}
                onSelect={handleAgentChange}
                isInteractable={isEditMode}
                label="Select Agent"
                activeAccordion={activeAccordion}
                onAccordionToggle={handleAccordionToggle}
                onView={(id) => handleViewDetails("agent", id)}
                accordionEntityName="agent"
            />
            <EnhancedSelect<PIKAAgent>
                componentType="agents"
                EnhancedComponent={EnhancedAgent}
                selectedItems={form.executor ? [form.executor] : []}
                onSelect={handleExecutorChange}
                isInteractable={isEditMode}
                label="Select Executor Agent"
                activeAccordion={activeAccordion}
                onAccordionToggle={handleAccordionToggle}
                onView={(id) => handleViewDetails("executor", id)}
                accordionEntityName="executor"
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
            <EnhancedSelect<PIKATask>
                componentType="tasks"
                EnhancedComponent={EnhancedTask}
                selectedItems={form.functions || []}
                onSelect={handleFunctionsChange}
                isInteractable={isEditMode}
                multiple
                label="Select Functions"
                activeAccordion={activeAccordion}
                onAccordionToggle={handleAccordionToggle}
                onView={(id) => handleViewDetails("task", id)}
                accordionEntityName="functions"
            />
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                {dialogContent}
            </Dialog>
        </GenericFlexibleView>
    );
};

export default ChatFlexibleView;