import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    TextField,
    Box,
} from '@mui/material';
import { ChatComponentProps, PIKAChat, getDefaultChatForm } from '../../../../types/ChatTypes';
import EnhancedSelect from '../../common/enhanced_select/EnhancedSelect';
import AgentShortListView from '../../agent/agent/AgentShortListView';
import TaskShortListView from '../../task/task/TaskShortListView';
import { PIKAAgent } from '../../../../types/AgentTypes';
import { PIKATask } from '../../../../types/TaskTypes';
import { useApi } from '../../../../contexts/ApiContext';
import GenericFlexibleView from '../../common/enhanced_component/FlexibleView';
import MessageListView from '../../message/message/MessageListView';
import { useCardDialog } from '../../../../contexts/CardDialogContext';

const ChatFlexibleView: React.FC<ChatComponentProps> = ({
    item,
    onChange,
    mode,
    handleSave,
}) => {
    const { fetchItem } = useApi();
    const { selectCardItem } = useCardDialog();
    const [form, setForm] = useState<Partial<PIKAChat>>(item || getDefaultChatForm());
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const isEditMode = mode === 'edit' || mode === 'create';

    useEffect(() => {
        if (isSaving) {
            handleSave();
            setIsSaving(false);
        }
    }, [isSaving, handleSave]);
    
    useEffect(() => {
        if (item) {
            setForm(item);
        }
    }, [item]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    }, []);

    const handleAgentChange = useCallback(async (selectedIds: string[]) => {
        if (selectedIds.length > 0) {
            const agent = await fetchItem('agents', selectedIds[0]) as PIKAAgent;
            setForm(prevForm => ({ ...prevForm, pika_agent: agent }));
        } else {
            setForm(prevForm => ({ ...prevForm, pika_agent: undefined }));
        }
    }, [fetchItem]);

    const handleFunctionsChange = useCallback(async (selectedIds: string[]) => {
        const functions = await Promise.all(selectedIds.map(id => fetchItem('tasks', id) as Promise<PIKATask>));
        setForm(prevForm => ({ ...prevForm, functions }));
    }, [fetchItem]);

    const handleAccordionToggle = useCallback((accordion: string | null) => {
        setActiveAccordion(prevAccordion => prevAccordion === accordion ? null : accordion);
    }, []);

    const handleLocalSave = useCallback(() => {
        onChange(form);
        setIsSaving(true);
    }, [form, onChange]);

    const title = mode === 'create' ? 'Create New Chat' : mode === 'edit' ? 'Edit Chat' : 'Chat Details';
    const saveButtonText = form._id ? 'Update Chat' : 'Create Chat';

    const memoizedAgentSelect = useMemo(() => (
        <EnhancedSelect<PIKAAgent>
            componentType="agents"
            EnhancedView={AgentShortListView}
            selectedItems={form.pika_agent ? [form.pika_agent] : []}
            onSelect={handleAgentChange}
            isInteractable={isEditMode}
            label="Select Agent"
            activeAccordion={activeAccordion}
            onAccordionToggle={handleAccordionToggle}
            accordionEntityName="agent"
            showCreateButton={true}
        />
    ), [form.pika_agent, handleAgentChange, isEditMode, activeAccordion, handleAccordionToggle]);
    
      const memoizedTaskSelect = useMemo(() => (
        <EnhancedSelect<PIKATask>
            componentType="tasks"
            EnhancedView={TaskShortListView}
            selectedItems={form.functions || []}
            onSelect={handleFunctionsChange}
            isInteractable={isEditMode}
            multiple
            label="Select Functions"
            activeAccordion={activeAccordion}
            onAccordionToggle={handleAccordionToggle}
            accordionEntityName="functions"
            showCreateButton={true}
        />
    ), [form.functions, handleFunctionsChange, isEditMode, activeAccordion, handleAccordionToggle]);

    return (
        <GenericFlexibleView
            elementType='Chat'
            title={title}
            onSave={handleLocalSave}
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
            {memoizedAgentSelect}
            {memoizedTaskSelect}
            <Box mt={2}>
                <MessageListView
                    items={form.messages || []}
                    item={null}
                    onChange={() => { }}
                    mode={'view'}
                    handleSave={async () => { }}
                    onView={(message) => selectCardItem && selectCardItem('Message', message._id ?? '', message)}
                />
            </Box>
        </GenericFlexibleView>
    );
};

export default ChatFlexibleView;