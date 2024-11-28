import React from 'react';
import { PIKATask, TaskComponentProps } from '../../../../types/TaskTypes';
import EnhancedShortListView from '../../common/enhanced_component/ShortListView';

const TaskShortListView: React.FC<TaskComponentProps> = ({
    items,
    item,
    onInteraction,
    onView,
}) => {
    const getPrimaryText = (task: PIKATask) => task.task_name;
    const getSecondaryText = (task: PIKATask) => `[${task.task_type || ''}]${task.task_description || ''}`

    return (
        <EnhancedShortListView<PIKATask>
            items={items}
            item={item}
            getPrimaryText={getPrimaryText}
            getSecondaryText={getSecondaryText}
            onView={onView}
            onInteraction={onInteraction}
        />
    );
};

export default TaskShortListView;