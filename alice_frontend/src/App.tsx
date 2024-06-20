import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPIKA from './pages/ChatPIKA';
import MainLayout from './layouts/MainLayout';
import PIKATools from './pages/PIKATools';
import CreateWorkflow from './pages/CreateWorkflow';
import Database from './pages/Database';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat-pika" element={<ChatPIKA />} />
          <Route path="/pika-tools" element={<PIKATools />} />
          <Route path="/start-workflow" element={<CreateWorkflow />} />
          <Route path="/database" element={<Database />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;