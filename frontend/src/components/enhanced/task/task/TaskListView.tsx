import React from 'react';
import { PIKATask, TaskComponentProps, taskDescriptions } from '../../../../types/TaskTypes';
import { IconButton, Tooltip, Typography } from '@mui/material';
import EnhancedListView from '../../common/enhanced_component/ListView';
import { Functions } from '@mui/icons-material';
import { formatCamelCaseString } from '../../../../utils/StyleUtils';

const TaskListView: React.FC<TaskComponentProps> = ({
    items,
    item,
    onInteraction,
    onView,
}) => {
    const getPrimaryText = (task: PIKATask) => task.task_name;
    const getSecondaryText = (task: PIKATask) => (
        <>
            <Tooltip title={formatCamelCaseString(task.task_type)}>
                <IconButton size="small">
                    {taskDescriptions[task.task_type].icon || <Functions />}
                </IconButton>
            </Tooltip>
            <Typography component="span" variant="body2" color="textPrimary">
                {task.task_description || 'N/A'}
            </Typography>
        </>
    );

    return (
        <EnhancedListView<PIKATask>
            items={items as PIKATask[]}
            item={item as PIKATask}
            getPrimaryText={getPrimaryText}
            getSecondaryText={getSecondaryText}
            onView={onView}
            onInteraction={onInteraction}
            interactionTooltip="Add Task"
            viewTooltip="View Task"
            collectionElementString='Task'
        />
    );
};

export default TaskListView;