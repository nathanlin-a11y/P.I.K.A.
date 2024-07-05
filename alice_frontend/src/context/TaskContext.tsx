import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { TaskResponse } from '../utils/TaskResponseTypes';
import { useApi } from './ApiContext';
import { PIKATask } from '../utils/TaskTypes';

interface TaskContextType {
  tasks: PIKATask[];
  selectedTask: PIKATask | null;
  taskResults: TaskResponse[];
  selectedResult: TaskResponse | null;
  inputValues: { [key: string]: any };
  executionStatus: 'idle' | 'progress' | 'success';
  fetchTasks: () => Promise<void>;
  fetchTaskResults: () => Promise<void>;
  handleSelectTask: (task: PIKATask) => void;
  handleInputChange: (key: string, value: any) => void;
  setInputValues: (values: { [key: string]: any }) => void;
  handleExecuteTask: () => Promise<void>;
  setSelectedResult: (result: TaskResponse | null) => void;
  createNewTask: (task: Partial<PIKATask>) => Promise<Partial<PIKATask> | undefined>;
  updateTask: (taskId: string, task: Partial<PIKATask>) => Promise<Partial<PIKATask> | undefined>;
  setSelectedTask: (task: PIKATask | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { fetchItem, createItem, updateItem, executeTask } = useApi();
  const [tasks, setTasks] = useState<PIKATask[]>([]);
  const [selectedTask, setSelectedTask] = useState<PIKATask | null>(null);
  const [taskResults, setTaskResults] = useState<TaskResponse[]>([]);
  const [selectedResult, setSelectedResult] = useState<TaskResponse | null>(null);
  const [inputValues, setInputValues] = useState<{ [key: string]: any }>({});
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'progress' | 'success'>('idle');

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await fetchItem('tasks');
      setTasks(fetchedTasks as PIKATask[]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchTaskResults = async () => {
    try {
      const fetchedResults = await fetchItem('taskresults');
      setTaskResults(fetchedResults as TaskResponse[]);
    } catch (error) {
      console.error('Error fetching task results:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTaskResults();
  }, []);

  const handleSelectTask = (task: PIKATask) => {
    setSelectedTask(task);
    console.log('Selected task in context:', task);
    setInputValues({});
    setExecutionStatus('idle');
  };

  const handleInputChange = (key: string, value: any) => {
    setInputValues({ ...inputValues, [key]: value });
  };

  const handleExecuteTask = async () => {
    if (!selectedTask || !selectedTask._id) return;
    try {
      console.log('Executing task:', selectedTask._id, inputValues);
      setExecutionStatus('progress');
      const result = await executeTask(selectedTask._id, inputValues);
      await fetchTaskResults();
      setSelectedResult(result);
      setExecutionStatus('success');
    } catch (error) {
      console.error('Error executing task:', error);
      setExecutionStatus('idle');
    }
  }

  const createNewTask = async (task: Partial<PIKATask>) => {
    try {
      if (!task._id) {
        return await createItem('tasks', task);
      } else {
        return await updateItem('tasks', task._id, task);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const updateTask = async (taskId: string, task: Partial<PIKATask>) => {
    try {
      return await updateItem('tasks', taskId, task);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  const value: TaskContextType = {
    tasks,
    selectedTask,
    taskResults,
    selectedResult,
    inputValues,
    executionStatus,
    fetchTasks,
    fetchTaskResults,
    handleSelectTask,
    handleInputChange,
    setInputValues,
    handleExecuteTask,
    setSelectedResult,
    createNewTask,
    updateTask,
    setSelectedTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};