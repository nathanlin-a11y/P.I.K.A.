import React, { useState, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './Theme';
import HomePage from './pages/HomePage';
import ChatPIKA from './pages/ChatPIKA';
import MainLayout from './layouts/main_layout/MainLayout';
import CreateWorkflow from './pages/StartTask';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './layouts/ProtectedRoute';
import Database from './pages/Database';
import UserSettings from './pages/UserSettings';
import NavigationGuard from './components/navigation/NavigationGuard';
import { AuthProvider } from './context/AuthContext';
import './assets/fonts/fonts.css';
import { ApiProvider } from './context/ApiContext';
import ErrorBoundary from './layouts/ErrorBoundary';

const App: React.FC = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleConfirmNavigation = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const handleSetHasUnsavedChanges = useCallback((value: boolean) => {
    setHasUnsavedChanges(value);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavigationGuard
            hasUnsavedChanges={hasUnsavedChanges}
            onConfirmNavigation={handleConfirmNavigation}
          >
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={
                  <ApiProvider>
                    <Register />
                  </ApiProvider>
                } />
                <Route path="/chat-pika" element={<ProtectedRoute element={<ChatPIKA />} />} />
                <Route path="/start-task" element={<ProtectedRoute element={<CreateWorkflow />} />} />
                <Route path="/database" element={<ProtectedRoute element={<Database />} />} />
                <Route
                  path="/user-settings"
                  element={
                    <ProtectedRoute
                      element={<UserSettings setHasUnsavedChanges={handleSetHasUnsavedChanges} />}
                    />
                  }
                />
              </Routes>
            </MainLayout>
          </NavigationGuard>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;