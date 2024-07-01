import React from 'react';
import { List, ListItemButton, ListItemText } from '@mui/material';
import { PIKAChat } from '../../utils/types';
import useStyles from '../../styles/ChatListStyles';

interface ChatListProps {
  pastChats: PIKAChat[];
  handleSelectChat: (chatId: string) => Promise<void>;
}

const ChatList: React.FC<ChatListProps> = ({ pastChats, handleSelectChat }) => {
  const classes = useStyles();

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleString();
  };

  const getChatTitle = (chat: PIKAChat) => {
    if (chat.name) return chat.name;
    if (chat.messages && chat.messages.length > 0) {
      const firstMessage = chat.messages[0].content;
      return firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
    }
    return `Chat ${formatDate(chat.createdAt)}`;
  };

  return (
    <List className={classes.chatList}>
      {pastChats.map((chat) => (
        <ListItemButton
          key={chat._id}
          onClick={() => handleSelectChat(chat._id)}
        >
          <ListItemText
            primary={getChatTitle(chat)}
            secondary={formatDate(chat.createdAt)}
          />
        </ListItemButton>
      ))}
    </List>
  );
};

export default ChatList;