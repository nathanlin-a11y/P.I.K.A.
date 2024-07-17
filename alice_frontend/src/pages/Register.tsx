import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import IntentSelection from '../components/ui/registration/IntentSelection';
import ApiSuggestions from '../components/ui/registration/ApiSuggestions';
import ApiSetup from '../components/ui/registration/ApiSetup';
import RegistrationComplete from '../components/ui/registration/RegistrationComplete';
import { API } from '../utils/ApiTypes';
import { createItem } from '../services/api';
import useStyles from '../styles/RegisterStyles';
import { WavyBackground } from '../components/ui/WavyBackground';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState(0);
  const [userIntent, setUserIntent] = useState('');
  const [suggestedApis, setSuggestedApis] = useState<API[]>([]);
  const [configuredApis, setConfiguredApis] = useState<API[]>([]);
  const classes = useStyles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Use registerUser service directly to perform registration
      await register(name, email, password);
      setStep(1); // Move to the next step after successful registration
    } catch (error) {
      setError('Registration failed. Please check your details and try again.');
    }
  };

  const handleApiSuggestions = (apis: API[]) => {
    const apisWithUser = apis.map(api => ({ ...api, user: { name, email } }));
    setSuggestedApis(apisWithUser);
    setStep(3);
  };

  const handleApiSetupComplete = async (apis: API[]) => {
    setConfiguredApis(apis);
    try {
      // Create each API individually
      for (const api of configuredApis) {
        await createItem('apis', api);
      }
      setStep(4); // Move to the final step
    } catch (error) {
      setError('Failed to save API configurations. Please try again.');
    }
  };

  const handleComplete = async () => {
    try {
      // Call the login function after all steps are complete
      console.log('Completing registration...');
      navigate('/chat-pika'); // Navigate to the chat page after completion
    } catch (error) {
      setError('Failed to log in after registration. Please try again.');
    }
  };

  const steps = [
    {
      label: 'Create Account',
      content: (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
      ),
    },
    {
      label: 'Select Intent',
      content: <IntentSelection onSelect={(intent: string) => { setUserIntent(intent); setStep(2); }} />,
    },
    {
      label: 'API Suggestions',
      content: <ApiSuggestions intent={userIntent} onSuggest={handleApiSuggestions} />,
    },
    {
      label: 'API Setup',
      content: <ApiSetup apis={suggestedApis} onComplete={handleApiSetupComplete} />,
    },
    {
      label: 'Complete',
      content: <RegistrationComplete onComplete={handleComplete} />,
    },
  ];

  return (
    <WavyBackground>
    <Container maxWidth="sm" className={classes.registerContainer}>
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <Stepper activeStep={step} orientation="vertical">
          {steps.map((stepData, index) => (
            <Step key={index}>
              <StepLabel>{stepData.label}</StepLabel>
              <StepContent>
                {stepData.content}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Container>
    </WavyBackground>
  );
};

export default Register;
