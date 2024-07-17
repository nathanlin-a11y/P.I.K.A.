import React, { useEffect } from 'react';
import { Box, FormControl, InputLabel, Typography } from '@mui/material';
import PromptAgentTask from './PromptAgentTask';
import { AgentWithFunctionsForm, TaskFormProps, PIKATask, PromptAgentTaskForm } from '../../../../utils/TaskTypes';
import EnhancedAgent from '../../../agent/agent/EnhancedAgent';
import EnhancedTask from '../EnhancedTask';
import { PIKAAgent } from '../../../../utils/AgentTypes';

const AgentWithFunctions: React.FC<TaskFormProps<AgentWithFunctionsForm>> = ({
  form,
  setForm,
  viewOnly
}) => {
  useEffect(() => {
    console.log('[1-LOG] Initial form state:', form);
  }, [form]);

  const handleBaseFormChange = (newBaseForm: PromptAgentTaskForm) => {
    setForm({ ...form, ...newBaseForm });
  };

  const handleTasksChange = (selectedTask: Partial<PIKATask>) => {
    const newTasks = { ...form.tasks };
    if (selectedTask._id) {
      if (selectedTask._id in newTasks) {
        delete newTasks[selectedTask._id];
      } else {
        newTasks[selectedTask._id] = selectedTask as PIKATask;
      }
    }
    setForm({ ...form, tasks: newTasks });
  };

  const handleExecutionAgentChange = (selectedAgent: Partial<PIKAAgent>) => {
    console.log('[5-LOG] New execution agent:', selectedAgent);
    setForm({ ...form, execution_agent: selectedAgent as PIKAAgent });
  };

  useEffect(() => {
    console.log('[8-LOG] Current form state:', form);
  }, [form]);

  return (
    <Box>
      <PromptAgentTask
        form={form}
        setForm={handleBaseFormChange}
        viewOnly={viewOnly}
      />
     
      <FormControl fullWidth margin="normal" disabled={viewOnly}>
        <Typography variant="subtitle1" gutterBottom>Tasks</Typography>
        <EnhancedTask
          mode="list"
          fetchAll={true}
          onInteraction={handleTasksChange}
          isInteractable={!viewOnly}
        />
      </FormControl>
      <FormControl fullWidth margin="normal" disabled={viewOnly}>
        <InputLabel>Execution Agent</InputLabel>
        <EnhancedAgent
          mode="list"
          fetchAll={true}
          onInteraction={handleExecutionAgentChange}
          isInteractable={!viewOnly}
        />
      </FormControl>
    </Box>
  );
};

export default AgentWithFunctions;