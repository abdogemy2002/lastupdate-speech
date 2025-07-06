import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import MessageBubble from './MessageBubble';
import MessageDateSeparator from './MessageDateSeparator';

const MessageList = ({
    messages,
    selectedConversation,
    currentUserId,
    firstName,
    lastName,
    loading,
    getOtherUser
}) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const groupMessagesByDate = (messages) => {
        const grouped = {};
        messages.forEach(message => {
            const date = formatDate(message.sentAt);
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(message);
        });
        return grouped;
    };

    const groupedMessages = groupMessagesByDate(messages);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!selectedConversation) {
        return null;
    }

    return (
        <Box sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            backgroundColor: '#e5ddd5',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/absurdity.png")',
            backgroundBlendMode: 'multiply'
        }}>
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <React.Fragment key={date}>
                    <MessageDateSeparator date={date} />

                    {dateMessages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isCurrentUser={message.senderId === currentUserId}
                            currentUserName={`${firstName} ${lastName}`}
                            otherUserName={getOtherUser(selectedConversation)}
                        />
                    ))}
                </React.Fragment>
            ))}
        </Box>
    );
};

export default MessageList;