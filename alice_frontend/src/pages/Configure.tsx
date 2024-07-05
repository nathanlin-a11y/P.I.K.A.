import React, { useState, useCallback } from 'react';
import { Box, Button, Stack, Typography, Skeleton } from '@mui/material';
import VerticalMenuSidebar from '../components/ui/vertical_menu/VerticalMenuSidebar';
import { useConfig } from '../context/ConfigContext';
import useStyles from '../styles/ConfigureStyles';
import { ComponentMode, } from '../utils/Types';
import { PIKAModel } from '../utils/ModelTypes';
import { Prompt } from '../utils/PromptTypes';
import { ParameterDefinition } from '../utils/ParameterTypes';
import { PIKATask } from '../utils/TaskTypes';
import { TaskResponse } from '../utils/TaskResponseTypes';
import { PIKAAgent } from '../utils/AgentTypes';
import { TASK_SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '../utils/Constants';
import { Person, Mode, Settings, Description, Functions, Assignment, Chat } from '@mui/icons-material';
import EnhancedAgent from '../components/agent/Agent';
import EnhancedPrompt from '../components/prompt/Prompt';
import EnhancedModel from '../components/model/Model';
import EnhancedParameter from '../components/parameter/Parameter';
import EnhancedTask from '../components/task/Task';
import EnhancedTaskResult from '../components/task_response/TaskResponse';
import EnchancedChat from '../components/chat/chat/EnhancedChat';
import { PIKAChat } from '../utils/ChatTypes';

const Configure: React.FC = () => {
    const classes = useStyles();
    const { selectedItem, setSelectedItem, refreshItems } = useConfig();
    const [activeTab, setActiveTab] = useState('Agent');
    const [isCreating, setIsCreating] = useState(false);
    const [showActiveComponent, setShowActiveComponent] = useState(false);

    const tabs = [
        { name: 'Agent', icon: Person },
        { name: 'Model', icon: Mode },
        { name: 'Parameter', icon: Settings },
        { name: 'Prompt', icon: Description },
        { name: 'Task', icon: Functions },
        { name: 'Task Results', icon: Assignment },
        { name: 'Select Chat', icon: Chat },
    ];

    const handleItemSelect = useCallback((item: PIKAAgent | PIKAModel | ParameterDefinition | Prompt | PIKATask | TaskResponse | PIKAChat) => {
        console.log('Item selected:', item);
        setSelectedItem(item);
        setIsCreating(false);
        setShowActiveComponent(true);
    }, [setSelectedItem]);

    const handleCreateNew = useCallback(() => {
        console.log('Create new clicked');
        setSelectedItem(null);
        setIsCreating(true);
        setShowActiveComponent(true);
    }, [setSelectedItem]);

    const handleSave = useCallback(async (item: PIKAAgent | PIKAModel | ParameterDefinition | Prompt | PIKATask | TaskResponse | PIKAChat) => {
        console.log('Saving item:', item);
        await refreshItems();
        setSelectedItem(null);
        setIsCreating(false);
        setShowActiveComponent(false);
    }, [refreshItems, setSelectedItem]);

    const renderActiveList = useCallback(() => {
        const commonProps = {
            mode: 'list' as const,
            fetchAll: true,
            onInteraction: handleItemSelect,
            isInteractable: true,
        };

        return (
            <Box>
                <Button variant="contained" color="primary" onClick={handleCreateNew} className={classes.createButton}>
                    Create New {activeTab}
                </Button>
                {(() => {
                    switch (activeTab) {
                        case 'Agent':
                            return <EnhancedAgent {...commonProps} />;
                        case 'Model':
                            return <EnhancedModel {...commonProps} />;
                        case 'Parameter':
                            return <EnhancedParameter {...commonProps} />;
                        case 'Prompt':
                            return <EnhancedPrompt {...commonProps} />;
                        case 'Task':
                            return <EnhancedTask {...commonProps} />;
                        case 'Task Results':
                            return <EnhancedTaskResult {...commonProps}/>;
                        case 'Select Chat':
                            return <EnchancedChat {...commonProps} />;
                        default:
                            return null;
                    }
                })()}
            </Box>
        );
    }, [activeTab, handleCreateNew, handleItemSelect]);

    const renderActiveComponent = useCallback(() => {
        if (!showActiveComponent) {
            return (
                <Stack spacing={1}>
                    <Typography variant="h6">Please select an item or create a new one to start configuring.</Typography>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="rectangular" height={80} />
                    <Skeleton variant="circular" className={classes.right_circle} width={40} height={40}/>
                    <Skeleton variant="rounded" height={90} />
                </Stack>
            );
        }

        console.log('Rendering active component. isCreating:', isCreating, 'selectedItem:', selectedItem);
        const commonProps = {
            mode: (isCreating ? 'create' : 'edit') as ComponentMode,
            fetchAll: false,
            onSave: handleSave,
            itemId: selectedItem?._id,
        };
        switch (activeTab) {
            case 'Agent':
                return <EnhancedAgent {...commonProps} />;
            case 'Model':
                return <EnhancedModel {...commonProps} />;
            case 'Parameter':
                return <EnhancedParameter {...commonProps} />;
            case 'Prompt':
                return <EnhancedPrompt {...commonProps} />;
            case 'Task':
                return <EnhancedTask {...commonProps} />;
            case 'Task Results':
                return <EnhancedTaskResult {...commonProps} mode={'card'}/>;
            case 'Select Chat':
                return <EnchancedChat {...commonProps} mode={'full'} />;
            default:
                return null;
        }
    }, [activeTab, isCreating, selectedItem, handleSave, showActiveComponent, classes.right_circle]);

    return (
        <Box className={classes.configureContainer}>
            <VerticalMenuSidebar
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={useCallback((tab) => {
                    console.log('Tab changed to:', tab);
                    setActiveTab(tab);
                    setSelectedItem(null);
                    setIsCreating(false);
                    setShowActiveComponent(false);
                }, [setSelectedItem])}
                renderContent={renderActiveList}
                expandedWidth={TASK_SIDEBAR_WIDTH}
                collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
            />
            <Box className={classes.configureContent}>
                {renderActiveComponent()}
            </Box>
        </Box>
    );
};

export default Configure;