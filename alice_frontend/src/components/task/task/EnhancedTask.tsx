import React from 'react';
import { PIKAChat } from '../../../utils/ChatTypes';
import { PIKATask, TaskType } from '../../../utils/TaskTypes';
import BaseDbElement, { BaseDbElementProps } from '../../BaseDbElement';
import { TaskComponentProps } from '../../../utils/TaskTypes';
import TaskFlexibleView from './TaskFlexibleView';
import TaskCardView from './TaskCardView';
import TaskListView from './TaskListView';
import TaskTableView from './TaskTableView';

type BaseTaskMode = BaseDbElementProps<PIKAChat>['mode'];
type ExtendedTaskMode = 'list' | 'shortList' | 'card' | 'table';
type EnhancedTaskMode = BaseTaskMode | ExtendedTaskMode;

interface EnhancedTaskProps extends Omit<TaskComponentProps, 'items' | 'item' | 'onChange' | 'handleSave' | 'mode'> {
    mode: EnhancedTaskMode;
    itemId?: string;
    fetchAll: boolean;
    onSave?: (savedItem: PIKATask) => void;
}

const EnhancedTask: React.FC<EnhancedTaskProps> = (props) => {
    const renderContent = (
        items: PIKATask[] | null,
        item: PIKATask | null,
        onChange: (newItem: Partial<PIKATask>) => void,
        mode: BaseTaskMode,
        handleSave: () => Promise<void>
    ) => {
        const commonProps: TaskComponentProps = {
            items,
            item,
            onChange,
            mode,
            handleSave,
            isInteractable: props.isInteractable,
            onInteraction: props.onInteraction,
            onAddTask: props.onAddTask,
        };
        switch (props.mode) {
            case 'create':
            case 'edit':
            case 'view':
                return <TaskFlexibleView {...commonProps} />;
            case 'list':
            case 'shortList':
                return <TaskListView {...commonProps} />;
            case 'table':
                return <TaskTableView {...commonProps} />;
            case 'card':
                return <TaskCardView {...commonProps} />;
            default:
                return null;
        }
    };

    const baseDbMode: BaseDbElementProps<PIKATask>['mode'] =
        props.mode === 'create' ? 'create' :
            props.mode === 'edit' ? 'edit' : 'view';

    return (
        <BaseDbElement<PIKATask>
            collectionName="tasks"
            itemId={props.itemId}
            mode={baseDbMode}
            isInteractable={props.isInteractable}
            onInteraction={props.onInteraction}
            onSave={props.onSave}
            fetchAll={props.fetchAll}
            render={renderContent}
        />
    );
};

export default EnhancedTask;