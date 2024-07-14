import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import { Visibility, PlayArrow } from '@mui/icons-material';
import { PIKAChat, ChatComponentProps } from '../../../utils/ChatTypes';

const ChatListView: React.FC<ChatComponentProps> = ({
    items,
    isInteractable = false,
    onInteraction,
    onView,
}) => {
    if (!items) return null;
    return (
        <List>
            {items.map((chat: PIKAChat) => (
                <ListItem key={chat._id}>
                    <ListItemText
                        primary={chat.name}
                        secondary={
                            <>
                                <Typography component="span" variant="body2" color="textPrimary">
                                    Agent: {chat.pika_agent?.name || 'N/A'}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2" color="textSecondary">
                                    Created: {new Date(chat.createdAt || '').toLocaleString()}
                                </Typography>
                            </>
                        }
                    />
                    <Box>
                        {onView && (
                            <Tooltip title="View Chat">
                                <IconButton edge="end" onClick={() => onView(chat)}>
                                    <Visibility />
                                </IconButton>
                            </Tooltip>
                        )}
                        {onInteraction && (
                            <Tooltip title="Add Chat">
                                <IconButton edge="end" onClick={() => onInteraction(chat)}>
                                    <PlayArrow />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </ListItem>
            ))}
        </List>
    );
};

export default ChatListView;