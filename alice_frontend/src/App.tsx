import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './Theme';
import HomePage from './pages/HomePage';
import ChatPIKA from './pages/ChatPIKA';
import MainLayout from './layouts/MainLayout';
import PIKATools from './pages/PIKATools';
import CreateWorkflow from './pages/StartTask';
import Database from './pages/Database';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ChatProvider } from './context/ChatContext';
import './assets/fonts/fonts.css';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This normalizes styles across browsers */}
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat-pika" element={<ProtectedRoute element={
                    <ChatProvider>
                      <ChatPIKA />
                    </ChatProvider>
                  } />} />
            <Route path="/pika-tools" element={<ProtectedRoute element={<PIKATools />} />} />
            <Route path="/start-task" element={<ProtectedRoute element={<CreateWorkflow />} />} />
            <Route path="/database" element={<ProtectedRoute element={<Database />} />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;