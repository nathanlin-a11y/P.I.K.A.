import React from 'react';
import { PIKATask, TaskComponentProps } from '../../../../types/TaskTypes';
import { IconButton, Typography } from '@mui/material';
import EnhancedListView from '../../../common/enhanced_component/ListView';
import { Functions } from '@mui/icons-material';
import { formatCamelCaseString } from '../../../../utils/StyleUtils';
import { taskDescriptions } from '../../../../utils/TaskUtilts';

const TaskListView: React.FC<TaskComponentProps> = ({
    items,
    item,
    onInteraction,
    onView,
}) => {
    const getPrimaryText = (task: PIKATask) => task.task_name;
    const getSecondaryText = (task: PIKATask) => (
        <>
            <IconButton size="small" title={formatCamelCaseString(task.task_type)}>
                {taskDescriptions[task.task_type].icon || <Functions />}
            </IconButton>
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