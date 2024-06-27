import React, { useState } from 'react';
import { Box } from '@mui/material';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import ChatInput from '../components/ChatInput';
import NewChat from '../components/NewChat';
import { useChat } from '../context/ChatContext';
import useStyles from './ChatPIKAStyles';
import { CreatePIKAChat } from '../utils/types';

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
    currentChat
  } = useChat();

  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const lastMessage = messages[messages.length - 1];

  const handleNewChatClick = () => {
    setIsNewChatModalOpen(true);
  };

  const handleNewChatCreated = async (chat: Partial<CreatePIKAChat>) => {
    try {
      createNewChat(chat);
      setIsNewChatModalOpen(false);
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
          handleNewChatClick={handleNewChatClick}
          agents={agents}
          currentChatId={currentChatId}
          currentChat={currentChat}
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
            lastMessage={lastMessage}
            chatSelected={!!currentChatId}
          />
        </Box>
      </Box>
      <NewChat
        open={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onChatCreated={handleNewChatCreated}
      />
    </Box>
  );
};

export default ChatPIKA;