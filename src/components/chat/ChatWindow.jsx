import React from 'react';
import {
    Box,
    Avatar,
    IconButton,
    TextField,
    Typography,
    CircularProgress,
    Chip
} from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';

const ChatWindow = ({
    isMobile,
    selectedConversation,
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleBack,
    currentUserId,
    firstName,
    lastName,
    loading,
    getOtherUser,
    formatTime,
    formatDate,
    groupMessagesByDate
}) => {
    if (!selectedConversation) {
        return !isMobile ? (
            <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f2f5'
            }}>
                <Typography variant="h6" color="textSecondary">
                    اختر محادثة لبدء الدردشة
                </Typography>
            </Box>
        ) : null;
    }

    const groupedMessages = groupMessagesByDate(messages);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: '100%'
        }}>
            <ChatHeader
                isMobile={isMobile}
                selectedConversation={selectedConversation}
                handleBack={handleBack}
                currentUserId={currentUserId}
                getOtherUser={getOtherUser}
            />

            <Box sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                backgroundColor: '#e5ddd5',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/absurdity.png")',
                backgroundBlendMode: 'multiply'
            }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <React.Fragment key={date}>
                        <Box sx={{ textAlign: 'center', my: 2 }}>
                            <Chip
                                label={date}
                                sx={{
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                    px: 2,
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>

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

            <Box sx={{
                p: 2,
                borderTop: '1px solid #e0e0e0',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center'
            }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="اكتب رسالة..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    multiline
                    maxRows={4}
                    sx={{
                        mr: 1,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '24px',
                            padding: '8px 16px',
                        }
                    }}
                />
                <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    sx={{
                        backgroundColor: '#20B2AA',
                        color: 'white',
                        '&:hover': { backgroundColor: '#1E9C96' },
                        '&:disabled': { backgroundColor: '#cccccc' }
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatWindow;