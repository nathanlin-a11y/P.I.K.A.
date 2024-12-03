import React from 'react';
import { TaskComponentProps, PIKATask } from '../../../../types/TaskTypes';
import EnhancedTableView, { Column } from '../../common/enhanced_component/TableView';
import { formatStringWithSpaces } from '../../../../utils/StyleUtils';

const TaskTableView: React.FC<TaskComponentProps> = ({
  items,
  item,
  isInteractable = false,
  onInteraction,
  onView,
  showHeaders = true,
}) => {
  const columns: Column<PIKATask>[] = [
    {
      header: 'Task Name',
      render: (task: PIKATask) => formatStringWithSpaces(task.task_name),
      sortKey: 'task_name'
    },
    {
      header: 'Description',
      render: (task: PIKATask) => task.task_description || 'N/A',
      sortKey: 'task_description'
    },
    {
      header: 'Type',
      render: (task: PIKATask) =>  task.task_type || 'N/A',
      sortKey: 'task_type'
    }
  ];

  return (
    <EnhancedTableView<PIKATask>
      items={items}
      item={item}
      columns={columns}
      onView={onView}
      onInteraction={onInteraction}
      showHeaders={showHeaders}
      interactionTooltip="Add Task"
      viewTooltip="View Task"
    />
  );
};

export default TaskTableView;