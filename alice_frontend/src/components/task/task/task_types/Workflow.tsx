import React from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, SelectChangeEvent } from '@mui/material';
import { TaskFormProps, WorkflowForm } from '../../../../utils/TaskTypes';

const Workflow: React.FC<TaskFormProps<WorkflowForm>> = ({ form, setForm, availableTasks, viewOnly }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTasksChange = (event: SelectChangeEvent<string[]>) => {
    const selectedTaskIds = event.target.value as string[];
    const newTasks: Map<string, string> = new Map();

    selectedTaskIds.forEach(taskId => {
      const task = availableTasks.find(t => t._id === taskId);
      if (task) {
        newTasks.set(task.task_name, taskId);
      }
    });

    setForm({ ...form, tasks: newTasks });
  };

  const handleStartTaskChange = (event: SelectChangeEvent<string>) => {
    setForm({ ...form, start_task: event.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm({ ...form, [name]: checked });
  };

  return (
    <Box>
      <TextField
        fullWidth
        margin="normal"
        name="task_name"
        label="Workflow Name"
        value={form.task_name || ''}
        onChange={handleInputChange}
        required
        disabled={viewOnly}
      />
      <TextField
        fullWidth
        margin="normal"
        name="task_description"
        label="Workflow Description"
        value={form.task_description || ''}
        onChange={handleInputChange}
        multiline
        rows={3}
        required
        disabled={viewOnly}
      />
      <TextField
        fullWidth
        margin="normal"
        name="input_variables"
        label="Input Variables (JSON)"
        value={form.input_variables || ''}
        onChange={handleInputChange}
        multiline
        rows={4}
        disabled={viewOnly}
      />
      <FormControl fullWidth margin="normal" disabled={viewOnly}>
        <InputLabel>Tasks</InputLabel>
        <Select
          multiple
          value={form.tasks ? Array.from(form.tasks.values()) : []}
          onChange={handleTasksChange}
          required
        >
          {availableTasks.map((task) => (
            <MenuItem key={task._id} value={task._id || ''}>
              {task.task_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal" disabled={viewOnly}>
        <InputLabel>Start Task</InputLabel>
        <Select
          value={form.start_task || ''}
          onChange={handleStartTaskChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {form.tasks && Array.from(form.tasks.entries()).map(([taskName, taskId]) => (
            <MenuItem key={taskId} value={taskId}>
              {taskName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        name="max_attempts"
        label="Max Attempts"
        type="number"
        value={form.max_attempts || ''}
        onChange={handleInputChange}
        inputProps={{ min: 1 }}
        disabled={viewOnly}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={form.recursive || false}
            onChange={handleCheckboxChange}
            name="recursive"
            disabled={viewOnly}
          />
        }
        label="Recursive"
      />
      {!viewOnly && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log('Creating Workflow:', form)}
          sx={{ mt: 2 }}
        >
          Create Workflow
        </Button>
      )}
    </Box>
  );
};

export default Workflow;