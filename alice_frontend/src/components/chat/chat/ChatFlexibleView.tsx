import React from 'react';
import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Chip,
    Button
} from '@mui/material';
import useStyles from '../ChatStyles';
import { ChatComponentProps } from '../../../utils/ChatTypes';
import { useConfig } from '../../../context/ConfigContext';

const ChatFlexibleView: React.FC<ChatComponentProps> = ({ 
    item,
    onChange,
    mode,
    handleSave
}) => {
    const classes = useStyles();
    const {
        agents,
        models,
        tasks,
    } = useConfig();

    if (!item) {
        return <Typography>No chat data available.</Typography>;
    }

    const updateChatField = (field: keyof typeof item, value: any) => {
        onChange({ ...item, [field]: value });
    };

    return (
        <Box className={classes.createEditForm}>
            <Typography variant="h6">
                {mode === 'create' ? 'Create New Chat' : mode === 'edit' ? 'Edit Chat' : 'Chat Details'}
            </Typography>
            <TextField
                fullWidth
                label="Chat Name"
                value={item.name || ''}
                onChange={(e) => updateChatField('name', e.target.value)}
                className={classes.formControl}
                disabled={mode === 'view'}
            />
            <FormControl fullWidth className={classes.formControl}>
                <InputLabel>Agent</InputLabel>
                <Select
                    value={item.pika_agent?._id || ''}
                    onChange={(e) => {
                        const selectedAgent = agents.find(agent => agent._id === e.target.value);
                        updateChatField('pika_agent', selectedAgent || item.pika_agent);
                    }}
                    disabled={mode === 'view'}
                >
                    {agents.map((agent) => (
                        <MenuItem key={agent._id} value={agent._id}>{agent.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
                <InputLabel>Model</InputLabel>
                <Select
                    value={item.llm_config?.config_list[0]?.model || ''}
                    onChange={(e) => {
                        const selectedModel = models.find(model => model._id === e.target.value);
                        if (selectedModel) {
                            updateChatField('llm_config', {
                                ...item.llm_config,
                                config_list: [{
                                    model: selectedModel.model,
                                    api_key: selectedModel.api_key,
                                    base_url: selectedModel.base_url,
                                }]
                            });
                        }
                    }}
                    disabled={mode === 'view'}
                >
                    {models.map((model) => (
                        <MenuItem key={model._id} value={model._id}>{model.short_name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Typography gutterBottom>Temperature: {item.llm_config?.temperature || 0.7}</Typography>
            <Slider
                value={item.llm_config?.temperature || 0.7}
                onChange={(_, newValue) => updateChatField('llm_config', {
                    ...item.llm_config,
                    temperature: newValue as number
                })}
                min={0}
                max={1}
                step={0.1}
                className={classes.slider}
                disabled={mode === 'view'}
            />
            <Typography gutterBottom>Timeout (seconds): {item.llm_config?.timeout || 300}</Typography>
            <Slider
                value={item.llm_config?.timeout || 300}
                onChange={(_, newValue) => updateChatField('llm_config', {
                    ...item.llm_config,
                    timeout: newValue as number
                })}
                min={30}
                max={600}
                step={30}
                className={classes.slider}
                disabled={mode === 'view'}
            />
            <Typography variant="subtitle1">Functions</Typography>
            <Box className={classes.chipContainer}>
                {tasks.map((task) => (
                    <Chip
                        key={task._id}
                        label={task.task_name}
                        onClick={() => {
                            if (mode !== 'view') {
                                const updatedFunctions = item.functions?.includes(task)
                                    ? item.functions.filter(f => f._id !== task._id)
                                    : [...(item.functions || []), task];
                                updateChatField('functions', updatedFunctions);
                            }
                        }}
                        color={item.functions?.some(f => f._id === task._id) ? "primary" : "default"}
                        disabled={mode === 'view'}
                    />
                ))}
            </Box>
            {mode !== 'view' && (
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.createButton}
                >
                    {mode === 'create' ? 'Create Chat' : 'Update Chat'}
                </Button>
            )}
        </Box>
    );
};

export default ChatFlexibleView;