import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat-pika" element={<ProtectedRoute element={<ChatPIKA />} />} />
          <Route path="/pika-tools" element={<ProtectedRoute element={<PIKATools />} />} />
          <Route path="/start-task" element={<ProtectedRoute element={<CreateWorkflow />} />} />
          <Route path="/database" element={<ProtectedRoute element={<Database />} />} />
        </Routes>
      </MainLayout>
    </AuthProvider>
  );
};

export default App;
