import React, { useCallback, useMemo, useRef } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import AgentShortListView from '../../../agent/agent/AgentShortListView';
import TaskShortListView from '../../../task/task/TaskShortListView';
import { TaskFormsProps } from '../../../../../types/TaskTypes';
import { PIKAAgent } from '../../../../../types/AgentTypes';
import { PIKATask } from '../../../../../types/TaskTypes';
import { ApiType } from '../../../../../types/ApiTypes';
import { FunctionParameters } from '../../../../../types/ParameterTypes';
import FunctionDefinitionBuilder from '../../../common/function_select/FunctionDefinitionBuilder';
import { useApi } from '../../../../../contexts/ApiContext';
import EnhancedSelect from '../../../common/enhanced_select/EnhancedSelect';

const BasicAgentTask: React.FC<TaskFormsProps> = ({
  item,
  onChange,
  mode,
  handleAccordionToggle,
  activeAccordion,
  apis
}) => {
  const { fetchItem } = useApi();
  const isEditMode = mode === 'edit' || mode === 'create';

  const itemRef = useRef(item);
  const onChangeRef = useRef(onChange);

  // Update refs when props change
  itemRef.current = item;
  onChangeRef.current = onChange;

  const availableApiTypes = useMemo(() => {
    if (!apis) return [];
    return Array.from(new Set(apis.map(api => api.api_type)));
  }, [apis]);

  const handleInputVariablesChange = useCallback((newDefinition: FunctionParameters) => {
    const currentItem = itemRef.current;
    if (currentItem) onChangeRef.current({ ...currentItem, input_variables: newDefinition });
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const currentItem = itemRef.current;
    if (currentItem) {
      const { name, value } = e.target;
      onChangeRef.current({ ...currentItem, [name]: value });
    }
  }, []);

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const currentItem = itemRef.current;
    if (currentItem) {
      const { name, checked } = e.target;
      onChangeRef.current({ ...currentItem, [name]: checked });
    }
  }, []);

  const handleRequiredApisChange = useCallback((event: SelectChangeEvent<ApiType[]>) => {
    const currentItem = itemRef.current;
    if (currentItem) {
      const value = event.target.value as ApiType[];
      onChangeRef.current({ ...currentItem, required_apis: value });
    }
  }, []);

  const memoizedAgentSelect = useMemo(() => (
    <EnhancedSelect<PIKAAgent>
      componentType="agents"
      EnhancedView={AgentShortListView}
      selectedItems={itemRef.current?.agent ? [itemRef.current.agent] : []}
      onSelect={async (selectedIds: string[]) => {
        const currentItem = itemRef.current;
        if (currentItem) {
          if (selectedIds.length > 0) {
            const agent = await fetchItem('agents', selectedIds[0]) as PIKAAgent;
            onChangeRef.current({ ...currentItem, agent: agent });
          } else {
            onChangeRef.current({ ...currentItem, agent: null });
          }
        }
      }}
      isInteractable={isEditMode}
      label="Select Agent"
      activeAccordion={activeAccordion}
      onAccordionToggle={handleAccordionToggle}
      accordionEntityName="agent"
      showCreateButton={true}
    />
  ), [item?.agent, isEditMode, activeAccordion, handleAccordionToggle, fetchItem]);

  const memoizedTaskSelect = useMemo(() => (
    <EnhancedSelect<PIKATask>
      componentType="tasks"
      EnhancedView={TaskShortListView}
      selectedItems={Object.values(itemRef.current?.tasks || {})}
      onSelect={async (selectedIds: string[]) => {
        const currentItem = itemRef.current;
        if (currentItem) {
          const tasks = await Promise.all(selectedIds.map(id => fetchItem('tasks', id) as Promise<PIKATask>));
          const tasksObject = tasks.reduce((acc, task) => {
            acc[task.task_name] = task;
            return acc;
          }, {} as Record<string, PIKATask>);
          onChangeRef.current({ ...currentItem, tasks: tasksObject });
        }
      }}
      isInteractable={isEditMode}
      multiple
      label="Select Tasks"
      activeAccordion={activeAccordion}
      onAccordionToggle={handleAccordionToggle}
      accordionEntityName="tasks"
      showCreateButton={true}
    />
  ), [item?.tasks, isEditMode, activeAccordion, handleAccordionToggle, fetchItem]);

  if (!item) {
    return <Box>No task data available.</Box>;
  }

  return (
    <Box>
      <TextField
        fullWidth
        margin="normal"
        name="task_name"
        label="Task Name"
        value={item.task_name || ''}
        onChange={handleInputChange}
        required
        disabled={!isEditMode}
      />
      <TextField
        fullWidth
        margin="normal"
        name="task_description"
        label="Task Description"
        value={item.task_description || ''}
        onChange={handleInputChange}
        multiline
        rows={3}
        required
        disabled={!isEditMode}
      />
      {memoizedAgentSelect}
      {memoizedTaskSelect}
      <FormControl fullWidth margin="normal">
        <InputLabel>Required API Types</InputLabel>
        <Select
          multiple
          value={item.required_apis || []}
          onChange={handleRequiredApisChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as ApiType[]).map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          disabled={!isEditMode}
        >
          {availableApiTypes.map((apiType) => (
            <MenuItem key={apiType} value={apiType}>
              {apiType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FunctionDefinitionBuilder
        initialParameters={item.input_variables || undefined}
        onChange={handleInputVariablesChange}
        isViewOnly={!isEditMode}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={item.human_input || false}
            onChange={handleCheckboxChange}
            name="human_input"
            disabled={!isEditMode}
          />
        }
        label="Requires Human Input"
      />
    </Box>
  );
};

export default React.memo(BasicAgentTask);