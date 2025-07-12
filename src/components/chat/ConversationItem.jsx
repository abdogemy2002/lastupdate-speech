import React from 'react';
import {
    ListItemText,
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
import {
    StyledListItem,
    StyledAvatar,
    StyledUserName,
    StyledMessageText,
    StyledTimeText,
    StyledUnreadBadge,
    StyledUnreadCountBox
} from './styles/chatStyles';

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
        <StyledListItem
            button
            selected={isSelected}
            onClick={() => onSelect(conversation)}
        >
            <ListItemAvatar>
                <Badge
                    badgeContent={unreadCount}
                    color="primary"
                    invisible={unreadCount === 0}
                    sx={StyledUnreadBadge}
                >
                    <StyledAvatar
                        alt={conversation.receiverDisplayName || `User ${otherUser}`}
                        src={conversation.receiverProfilePictureUrl} // ← عدل هنا
                    >
                        {(conversation.receiverDisplayName || `User ${otherUser}`).charAt(0)}
                    </StyledAvatar>
                </Badge>
            </ListItemAvatar>

            <ListItemText
                primary={
                    <StyledUserName component="span">
                        {conversation.receiverDisplayName || `User ${otherUser}`}
                    </StyledUserName>
                }
                secondary={
                    <StyledMessageText component="span">
                        {lastMessage?.content || 'لا توجد رسائل'}
                    </StyledMessageText>
                }
                secondaryTypographyProps={{
                    noWrap: true
                }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <StyledTimeText variant="caption" component="span">
                    {conversation.lastMessageAt &&
                        (isToday(conversation.lastMessageAt)
                            ? formatTime(conversation.lastMessageAt)
                            : formatDate(conversation.lastMessageAt))}
                </StyledTimeText>

                {unreadCount > 0 && (
                    <StyledUnreadCountBox>
                        <Typography variant="caption" component="span">
                            {unreadCount}
                        </Typography>
                    </StyledUnreadCountBox>
                )}
            </Box>
        </StyledListItem>
    );
};

export default ConversationItem;
