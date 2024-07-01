import React from 'react';
import { Box } from '@mui/material';
import PromptAgentTask from './PromptAgentTask';
import { PIKAAgent, Prompt, CodeGenerationLLMTaskForm } from '../../../utils/types';

interface CodeGenerationLLMTaskProps {
  form: CodeGenerationLLMTaskForm;
  setForm: React.Dispatch<React.SetStateAction<CodeGenerationLLMTaskForm>>;
  agents: PIKAAgent[];
  prompts: Prompt[];
}

const CodeGenerationLLMTask: React.FC<CodeGenerationLLMTaskProps> = ({ form, setForm, agents, prompts }) => {
  return (
    <Box>
      <PromptAgentTask form={form} setForm={setForm} agents={agents} prompts={prompts} />
    </Box>
  );
};

export default CodeGenerationLLMTask;