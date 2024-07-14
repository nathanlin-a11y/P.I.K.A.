import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PIKAModel } from '../utils/ModelTypes';
import { ParameterDefinition } from '../utils/ParameterTypes';
import { Prompt } from '../utils/PromptTypes';
import { TaskResponse } from '../utils/TaskResponseTypes';
import { PIKAAgent } from '../utils/AgentTypes';
import { PIKATask } from '../utils/TaskTypes';
import { useApi } from './ApiContext';
import { PIKAChat } from '../utils/ChatTypes';
import { API } from '../utils/ApiTypes';

export type ConfigItemType = 'Agent' | 'Model' | 'Parameter' | 'Prompt';

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
  setSelectedItemType: (type: ConfigItemType | null) => void; // Updated to allow null
  refreshItems: () => Promise<void>;
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
  const [selectedItemType, setSelectedItemType] = useState<ConfigItemType | null>("Agent"); // Updated to allow null

  const refreshItems = async () => {
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
  };

  useEffect(() => {
    refreshItems();
  }, []);

  const value: ConfigContextType = {
    agents,
    models,
    parameters,
    prompts,
    tasks,
    selectedItem,
    selectedItemType,
    setSelectedItem,
    setSelectedItemType,
    refreshItems,
    apis,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};