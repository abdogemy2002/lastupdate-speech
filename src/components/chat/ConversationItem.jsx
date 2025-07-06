import React from 'react';
import {
    ListItem,
    ListItemText,
    Avatar,
    Badge,
    Typography,
    Box,
    ListItemAvatar
} from '@mui/material';
import {
    formatTime,
    formatDate,
    isToday
} from './utils/dateUtils';
import { useChatContext } from './ChatContext';

const ConversationItem = ({
    conversation = {},
    currentUserId = '',
    isSelected = false,
    onSelect
}) => {
    const { lastSeen } = useChatContext();

    if (!conversation.user1Id || !conversation.user2Id) {
        return null;
    }

    const otherUser = conversation.user1Id === currentUserId
        ? conversation.user2Id
        : conversation.user1Id;

    const lastMessage = conversation.messages?.length > 0
        ? conversation.messages[conversation.messages.length - 1]
        : null;

    const unreadCount = conversation.messages?.filter(m => {
        const messageDate = new Date(m.sentAt);
        return (
            m.senderId !== currentUserId &&
            messageDate > new Date(lastSeen)
        );
    }).length || 0;

    return (
        <ListItem
            button
            selected={isSelected}
            onClick={() => onSelect(conversation)}
            sx={{
                borderBottom: '1px solid #B2EBF2',
                backgroundColor: isSelected ? '#FFECB3' : 'transparent',
                '&:hover': {
                    backgroundColor: '#E0F7FA'
                }
            }}
        >
            <ListItemAvatar>
                <Badge
                    badgeContent={unreadCount}
                    color="primary"
                    invisible={unreadCount === 0}
                    sx={{
                        '& .MuiBadge-badge': {
                            backgroundColor: '#E65100',
                            color: 'white',
                            fontFamily: "'Tajawal', sans-serif",
                            fontWeight: 'bold'
                        }
                    }}
                >
                    <Avatar
                        alt={conversation.receiverDisplayName || `User ${otherUser}`}
                        src={conversation.receiverProfileImage}
                        sx={{
                            bgcolor: '#20B2AA',
                            width: 40,
                            height: 40,
                            border: '2px solid white'
                        }}
                    >
                        {(conversation.receiverDisplayName || `User ${otherUser}`).charAt(0)}
                    </Avatar>
                </Badge>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography
                        sx={{
                            fontFamily: "'Tajawal', sans-serif",
                            fontWeight: 'bold',
                            color: '#00695C'
                        }}
                    >
                        {conversation.receiverDisplayName || `User ${otherUser}`}
                    </Typography>
                }
                secondary={
                    <Typography
                        sx={{
                            fontFamily: "'Tajawal', sans-serif",
                            color: unreadCount > 0 ? '#E65100' : '#0097A7',
                            fontWeight: unreadCount > 0 ? 'bold' : 'normal'
                        }}
                    >
                        {lastMessage?.content || 'لا توجد رسائل'}
                    </Typography>
                }
                secondaryTypographyProps={{
                    noWrap: true,
                    style: {
                        width: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }
                }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="caption" sx={{
                    fontFamily: "'Tajawal', sans-serif",
                    color: '#0097A7'
                }}>
                    {conversation.lastMessageAt &&
                        (isToday(conversation.lastMessageAt)
                            ? formatTime(conversation.lastMessageAt)
                            : formatDate(conversation.lastMessageAt))}
                </Typography>
                {unreadCount > 0 && (
                    <Box sx={{
                        bgcolor: '#E65100',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 0.5
                    }}>
                        <Typography variant="caption" sx={{
                            color: 'white',
                            fontFamily: "'Tajawal', sans-serif",
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                        }}>
                            {unreadCount}
                        </Typography>
                    </Box>
                )}
            </Box>
        </ListItem>
    );
};

export default ConversationItem;