import { PIKATask, RouteMap } from "../../../../../types/TaskTypes";
import { SimpleTaskData } from "./SimpleTaskNode";

export const getTaskByName = (
  parentTask: Partial<PIKATask>,
  taskName: string
): PIKATask | null => {
  return parentTask.tasks?.[taskName] || null;
};

export const getTaskRouteMap = (
  parentTask: Partial<PIKATask>,
  taskName: string
): RouteMap | null => {
  return parentTask.node_end_code_routing?.[taskName] || null;
};

// Create a type without onSizeChange for internal use
type SimpleTaskDataWithoutCallback = Omit<SimpleTaskData, 'onSizeChange'>;

export const getNodeData = (
  parentTask: Partial<PIKATask>,
  taskName: string
): PIKATask | SimpleTaskDataWithoutCallback | null => {
  // First try to get the actual task object
  const taskData = getTaskByName(parentTask, taskName);
  if (taskData) {
    return taskData;
  }

  // If we can't find the task but have routing info for it,
  // return null as this is likely an inner node of a task
  const routeMap = getTaskRouteMap(parentTask, taskName);
  if (!routeMap) {
    return null;
  }

  // Create a simplified task data object for the workflow node
  return {
    task_name: taskName,
    input_variables: parentTask.input_variables || null,
    exit_codes: parentTask.exit_codes || {}
  };
};

export const isFullTask = (
  data: PIKATask | SimpleTaskDataWithoutCallback | null
): data is PIKATask => {
  return data !== null && 'task_type' in data;
};

export const hasRequiredTaskData = (task: Partial<PIKATask>): task is PIKATask => {
  return !!task.node_end_code_routing && 
         !!task.task_name && 
         typeof task.task_name === 'string';
};