import React, { useState, useCallback, useEffect } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { PIKATask, TaskComponentProps, TaskType, getDefaultTaskForm } from '../../../../types/TaskTypes';
import { SelectChangeEvent } from '@mui/material';
import PromptAgentTask from './task_types/PromptAgentTask';
import CheckTask from './task_types/CheckTask';
import CodeGenerationLLMTask from './task_types/CodeGenerationLLMTask';
import CodeExecutionLLMTask from './task_types/CodeExecutionLLMTask';
import Workflow from './task_types/Workflow';
import ApiTask from './task_types/ApiTask';
import { API } from '../../../../types/ApiTypes';
import { useApi } from '../../../../contexts/ApiContext';
import GenericFlexibleView from '../../common/enhanced_component/FlexibleView';
import Logger from '../../../../utils/Logger';

const taskTypes: TaskType[] = [
    "PromptAgentTask",
    "CheckTask",
    "CodeGenerationLLMTask",
    "CodeExecutionLLMTask",
    "Workflow",
    "APITask",
    "EmbeddingTask",
    "GenerateImageTask",
    "TextToSpeechTask",
    "WebScrapeBeautifulSoupTask"
];

const TaskFlexibleView: React.FC<TaskComponentProps> = ({
    item,
    onChange,
    mode,
    handleSave
}) => {
    const { fetchItem } = useApi();
    const isEditMode = mode === 'edit' || mode === 'create';
    const [taskType, setTaskType] = useState<TaskType>(item?.task_type || "PromptAgentTask");
    const [form, setForm] = useState<PIKATask>(() => item || getDefaultTaskForm(taskType));
    const [apis, setApis] = useState<API[]>([]);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    Logger.debug('TaskFlexibleView', { item, mode, taskType, form, apis, activeAccordion, isSaving });

    useEffect(() => {
        if (isSaving) {
            handleSave();
            setIsSaving(false);
        }
    }, [isSaving, handleSave]);
    
    useEffect(() => {
        fetchItem('apis').then((data) => setApis(data as API[]));
    }, [fetchItem]);
    
    useEffect(() => {
        if (item) {
            setForm(item);
        }
    }, [item]);

    const handleTaskTypeChange = useCallback((event: SelectChangeEvent<TaskType>) => {
        const newType = event.target.value as TaskType;
        setTaskType(newType);
        setForm(getDefaultTaskForm(newType));
    }, []);

    const handleFormChange = useCallback((newFormData: Partial<PIKATask>) => {
        setForm(prevForm => ({ ...prevForm, ...newFormData }));
    }, []);

    const handleAccordionToggle = useCallback((accordion: string | null) => {
        setActiveAccordion(prevAccordion => prevAccordion === accordion ? null : accordion);
    }, []);

    const handleLocalSave = useCallback(async () => {
        onChange(form);
        setIsSaving(true);
    }, [form, onChange]);

    const renderTaskForm = () => {
        const commonProps = {
            items: null,
            item: form,
            onChange: handleFormChange,
            mode,
            handleSave: handleLocalSave,
            handleAccordionToggle,
            activeAccordion,
            apis
        };

        switch (taskType) {
            case 'PromptAgentTask':
                return <PromptAgentTask {...commonProps} />;
            case 'CheckTask':
                return <CheckTask {...commonProps} />;
            case 'CodeGenerationLLMTask':
                return <CodeGenerationLLMTask {...commonProps} />;
            case 'CodeExecutionLLMTask':
                return <CodeExecutionLLMTask {...commonProps} />;
            case 'Workflow':
                return <Workflow {...commonProps} />;
            case 'APITask':
                return <ApiTask {...commonProps} />;
            default:
                return null;
        }
    };

    const title = mode === 'create' ? 'Create New Task' : mode === 'edit' ? 'Edit Task' : 'Task Details';
    const saveButtonText = form._id ? 'Update Task' : 'Create Task';

    return (
        <GenericFlexibleView
            elementType='Task'
            title={title}
            onSave={handleLocalSave}
            saveButtonText={saveButtonText}
            isEditMode={isEditMode}
        >
            <FormControl fullWidth margin="normal" disabled={!isEditMode}>
                <InputLabel>Task Type</InputLabel>
                <Select value={taskType} onChange={handleTaskTypeChange}>
                    {taskTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {renderTaskForm()}
        </GenericFlexibleView>
    );
};

export default TaskFlexibleView;