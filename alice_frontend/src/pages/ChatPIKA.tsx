import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Chat from '../components/chat/Chat';
import Sidebar from '../components/chat/Sidebar';
import ChatInput from '../components/chat/ChatInput';
import { useChat } from '../context/ChatContext';
import useStyles from '../styles/ChatPIKAStyles';
import { CreatePIKAChat, PIKATask, TaskResponse } from '../utils/types';

const ChatPIKA: React.FC = () => {
  const classes = useStyles();
  const {
    messages,
    newMessage,
    setNewMessage,
    pastChats,
    currentChatId,
    agents,
    isGenerating,
    handleSelectChat,
    handleSendMessage,
    generateResponse,
    handleRegenerateResponse,
    createNewChat,
    currentChat,
    addTasksToChat,
    addTaskResultsToChat,
    isTaskInChat,
    isTaskResultInChat,
    fetchAvailableTasks,
    fetchAvailableTaskResults
  } = useChat();

  const [availableTasks, setAvailableTasks] = useState<PIKATask[]>([]);
  const [availableTaskResults, setAvailableTaskResults] = useState<TaskResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const tasks = await fetchAvailableTasks();
      const taskResults = await fetchAvailableTaskResults();
      setAvailableTasks(tasks);
      setAvailableTaskResults(taskResults);
    };
    fetchData();
  }, [fetchAvailableTasks, fetchAvailableTaskResults]);

  const handleNewChatCreated = async (chat: Partial<CreatePIKAChat>) => {
    try {
      return await createNewChat(chat);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  return (
    <Box className={classes.chatPIKAContainer}>
      <Box className={classes.chatPIKASidebar}>
        <Sidebar
          pastChats={pastChats}
          handleSelectChat={handleSelectChat}
          handleNewChatCreated={handleNewChatCreated}
          agents={agents}
          currentChatId={currentChatId}
          currentChat={currentChat}
          tasks={availableTasks}
          taskResults={availableTaskResults}
          onAddTasksToChat={addTasksToChat}
          onAddTaskResultsToChat={addTaskResultsToChat}
          isTaskInChat={isTaskInChat}
          isTaskResultInChat={isTaskResultInChat}
        />
      </Box>
      <Box className={classes.chatPIKAMain}>
        <Box className={classes.chatPIKAMessages}>
          <Chat
            messages={messages}
            isGenerating={isGenerating}
            onRequestResponse={generateResponse}
            onRegenerateResponse={handleRegenerateResponse}
            chatSelected={!!currentChatId}
          />
        </Box>
        <Box className={classes.chatPIKAInput}>
          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            lastMessage={messages[messages.length - 1]}
            chatSelected={!!currentChatId}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPIKA;