import React, { useState, useMemo, useCallback } from 'react';
import { Box, Dialog } from '@mui/material';
import { Add, Chat, Info, Functions, Assignment } from '@mui/icons-material';
import { TaskResponse } from '../types/TaskResponseTypes';
import { PIKATask } from '../types/TaskTypes';
import { PIKAChat } from '../types/ChatTypes';
import { TASK_SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '../utils/Constants';
import { useChat } from '../context/ChatContext';
import VerticalMenuSidebar from '../components/ui/vertical_menu/VerticalMenuSidebar';
import EnhancedChat from '../components/enhanced/chat/chat/EnhancedChat';
import EnhancedTask from '../components/enhanced/task/task/EnhancedTask';
import EnhancedTaskResponse from '../components/enhanced/task_response/task_response/EnhancedTaskResponse';
import ChatInput from '../components/enhanced/chat/ChatInput';
import useStyles from '../styles/ChatPIKAStyles';
import PlaceholderSkeleton from '../components/ui/placeholder_skeleton/PlaceholderSkeleton';
import EnhancedCardDialog from '../components/enhanced/common/enhanced_card_dialog/EnhancedCardDialog';
import { useCardDialog } from '../context/CardDialogContext';
import { CollectionElementString } from '../types/CollectionTypes';

const ChatPIKA: React.FC = () => {
  const classes = useStyles();
  const {
    messages,
    currentChatId,
    handleSelectChat,
    handleSendMessage,
    fetchChats,
    currentChat,
    setCurrentChatId,
    addTaskToChat,
    addTaskResultToChat,
    isTaskInChat,
  } = useChat();
  const { selectItem } = useCardDialog();

  const [openChatCreateDialog, setOpenChatCreateDialog] = useState(false);

  const [activeTab, setActiveTab] = useState('Select Chat');
  const [listKey, setListKey] = useState(0);

  const lastMessage = messages[messages.length - 1];

  const chatKey = useMemo(() => {
    return JSON.stringify(messages);
  }, [messages]);

  const handleNewChatCreated = async (chat: PIKAChat) => {
    await fetchChats();
    setCurrentChatId(chat?._id);
    setActiveTab('Current Chat');
  };

  const selectChatId = async (chat: PIKAChat) => {
    console.log('Selected chat:', chat);
    await handleSelectChat(chat._id);
    setActiveTab('Current Chat');
  };

  const handleCreateNew = useCallback(() => {
    setOpenChatCreateDialog(true);
  }, []);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === 'Select Chat') {
      setListKey(prev => prev + 1);
    }
  };

  const actions = [
    {
      name: `Create ${activeTab}`,
      icon: Add,
      action: handleCreateNew,
      disabled: activeTab === 'Task Results'
    }
  ];

  const tabs = [
    { name: 'Select Chat', icon: Chat },
    { name: 'Current Chat', icon: Info, disabled: !currentChatId },
    { name: 'Add Functions', icon: Functions, disabled: !currentChatId },
    { name: 'Add TaskResults', icon: Assignment, disabled: !currentChatId },
  ];

  const checkAndAddTask = (task: PIKATask) => {
    if (task._id && !isTaskInChat(task._id)) {
      addTaskToChat(task._id);
    }
  }

  const checkAndAddTaskResult = (taskResult: TaskResponse) => {
    if (taskResult._id) {
      addTaskResultToChat(taskResult._id);
    }
  }
  const triggerItemDialog = (collectionName: CollectionElementString, itemId: string) => {
    selectItem(collectionName, itemId);
  };

  const renderSidebarContent = (tabName: string) => {
    const handleProps = {
      handleAgentClick: (id: string) => triggerItemDialog('Agent', id),
      handleTaskClick: (id: string) => triggerItemDialog('Task', id),
      handleModelClick: (id: string) => triggerItemDialog('Model', id),
      handlePromptClick: (id: string) => triggerItemDialog('Prompt', id),
      handleParameterClick: (id: string) => triggerItemDialog('Parameter', id),
      handleAPIClick: (id: string) => triggerItemDialog('API', id),
    };

    switch (tabName) {
      case 'Select Chat':
        return (
          <EnhancedChat
            key={listKey}
            mode="shortList"
            onView={(chat) => triggerItemDialog('Chat', chat._id)}
            onInteraction={selectChatId}
            fetchAll={true}
            isInteractable={true}
            {...handleProps}
          />
        );
      case 'Current Chat':
        return (
          <EnhancedChat
            itemId={currentChat?._id}
            mode="card"
            fetchAll={false}
            {...handleProps}
          />
        );
      case 'Add Functions':
        return (
          <EnhancedTask
            mode={'list'}
            fetchAll={true}
            onInteraction={checkAndAddTask}
            onView={(task) => task._id && triggerItemDialog('Task', task._id)}
            {...handleProps}
          />
        );
      case 'Add TaskResults':
        return (
          <EnhancedTaskResponse
            mode={'list'}
            fetchAll={true}
            onView={(taskResult) => taskResult._id && triggerItemDialog('TaskResponse', taskResult._id)}
            onInteraction={checkAndAddTaskResult}
            {...handleProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box className={classes.chatPIKAContainer}>
      <VerticalMenuSidebar
        actions={actions}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        renderContent={renderSidebarContent}
        expandedWidth={TASK_SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      />
      <Box className={classes.chatPIKAMain}>
        <Box className={classes.chatPIKAMessages}>
          {currentChat ? (
            <EnhancedChat
              key={chatKey}
              itemId={currentChat._id}
              mode="full"
              fetchAll={false}
              showRegenerate={true}
            />
          ) : (
            <PlaceholderSkeleton
              mode="chat"
              text='Select a chat to start chatting with PIKA.'
            />
          )}
        </Box>
        <Box className={classes.chatPIKAInput}>
          <ChatInput
            sendMessage={handleSendMessage}
            lastMessage={lastMessage}
            currentChatId={currentChatId}
            chatSelected={!!currentChatId}
          />
        </Box>
        <EnhancedCardDialog />
        <Dialog open={openChatCreateDialog} onClose={() => setOpenChatCreateDialog(false)}>
          <EnhancedChat
            mode="create"
            fetchAll={false}
            onSave={handleNewChatCreated}
          />
        </Dialog>
      </Box>
    </Box>
  );
};

export default ChatPIKA;