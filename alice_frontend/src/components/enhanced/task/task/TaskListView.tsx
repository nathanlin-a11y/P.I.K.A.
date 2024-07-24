import React from 'react';
import { PIKATask, TaskComponentProps } from '../../../../utils/TaskTypes';
import { Typography } from '@mui/material';
import EnhancedListView from '../../common/enhanced_component/ListView';

const TaskListView: React.FC<TaskComponentProps> = ({
    items,
    item,
    onInteraction,
    onView,
}) => {
    const getPrimaryText = (task: PIKATask) => task.task_name;
    const getSecondaryText = (task: PIKATask) => (
            <>
                <Typography component="span" variant="body2" color="textPrimary">
                    Description: {task.task_description || 'N/A'}
                </Typography>
                <br />
                <Typography component="span" variant="body2" color="textSecondary">
                    Created: {new Date(task.createdAt || '').toLocaleString()}
                </Typography>
            </>
    );

    return (
        <EnhancedListView<PIKATask>
            items={items}
            item={item}
            getPrimaryText={getPrimaryText}
            getSecondaryText={getSecondaryText}
            onView={onView}
            onInteraction={onInteraction}
            interactionTooltip="Add Task"
            viewTooltip="View Task"
        />
    );
};

export default TaskListView;