import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { PIKAModel } from '../types/ModelTypes';
import { ParameterDefinition } from '../types/ParameterTypes';
import { Prompt } from '../types/PromptTypes';
import { TaskResponse } from '../types/TaskResponseTypes';
import { PIKAAgent } from '../types/AgentTypes';
import { PIKATask } from '../types/TaskTypes';
import { useApi } from './ApiContext';
import { PIKAChat } from '../types/ChatTypes';
import { API } from '../types/ApiTypes';

export type ConfigItemType = 'Agent' | 'Model' | 'Parameter' | 'Prompt' | 'Task' | 'TaskResponse' | 'Chat' | 'API';

interface ConfigContextType {
  agents: PIKAAgent[];
  models: PIKAModel[];
  parameters: ParameterDefinition[];
  prompts: Prompt[];
  tasks: PIKATask[];
  apis: API[];
  selectedItem: PIKAAgent | PIKAModel | ParameterDefinition | Prompt | PIKATask | TaskResponse | PIKAChat | API | null;
  selectedItemType: ConfigItemType | null;
  setSelectedItem: (item: PIKAAgent | PIKAModel | ParameterDefinition | Prompt | PIKATask | TaskResponse | PIKAChat | API | null) => void;
  setSelectedItemType: (type: ConfigItemType | null) => void;
  refreshItems: () => Promise<void>;
  triggerItemDialog: (itemType: ConfigItemType, itemId: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { fetchItem } = useApi();
  const [agents, setAgents] = useState<PIKAAgent[]>([]);
  const [models, setModels] = useState<PIKAModel[]>([]);
  const [parameters, setParameters] = useState<ParameterDefinition[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tasks, setTasks] = useState<PIKATask[]>([]);
  const [apis, setApis] = useState<API[]>([]);
  const [selectedItem, setSelectedItem] = useState<PIKAAgent | PIKAModel | ParameterDefinition | Prompt | PIKATask | TaskResponse | PIKAChat | API | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<ConfigItemType | null>(null);

  const refreshItems = useCallback(async () => {
    const fetchedAgents = await fetchItem('agents');
    const fetchedModels = await fetchItem('models');
    const fetchedParameters = await fetchItem('parameters');
    const fetchedPrompts = await fetchItem('prompts');
    const fetchedTasks = await fetchItem('tasks');
    const fetchedApis = await fetchItem('apis');

    setAgents(fetchedAgents as PIKAAgent[]);
    setModels(fetchedModels as PIKAModel[]);
    setParameters(fetchedParameters as ParameterDefinition[]);
    setPrompts(fetchedPrompts as Prompt[]);
    setTasks(fetchedTasks as PIKATask[]);
    setApis(fetchedApis as API[]);
  }, [fetchItem]);

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);

  const triggerItemDialog = useCallback((itemType: ConfigItemType, itemId: string) => {
    setSelectedItemType(itemType);
    setSelectedItem({ _id: itemId } as any);
  }, []);

  const value: ConfigContextType = {
    agents,
    models,
    parameters,
    prompts,
    tasks,
    apis,
    selectedItem,
    selectedItemType,
    setSelectedItem,
    setSelectedItemType,
    refreshItems,
    triggerItemDialog,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};