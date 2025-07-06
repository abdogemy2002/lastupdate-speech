import React from 'react';
import { Box, Typography } from '@mui/material';

const MessageBubble = ({ message, isCurrentUser, currentUserName, otherUserName, formatTime }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                mb: 2
            }}
        >
            <Box
                sx={{
                    maxWidth: '75%',
                    p: 1.5,
                    borderRadius: isCurrentUser ? '18px 0 18px 18px' : '0 18px 18px 18px',
                    backgroundColor: isCurrentUser ? '#dcf8c6' : 'white',
                    boxShadow: '0 1px 1px rgba(0,0,0,0.15)',
                    position: 'relative'
                }}
            >
                <Typography variant="body1">
                    {message.content}
                </Typography>
                <Typography
                    variant="caption"
                    display="block"
                    textAlign="right"
                    color="textSecondary"
                    sx={{ mt: 0.5 }}
                >
                    {formatTime(message.sentAt)}

                    {isCurrentUser && (
                        <span style={{
                            marginLeft: 5,
                            color: message.status === 'Sending' ? '#aaa' :
                                message.status === 'Sent' ? '#4CAF50' : '#F44336'
                        }}>
                            {message.status === 'Sending' ? '...' :
                                message.status === 'Sent' ? '✓' : '✕'}
                        </span>
                    )}
                </Typography>

                {!isCurrentUser && (
                    <Typography
                        variant="caption"
                        display="block"
                        textAlign="left"
                        color="textSecondary"
                        sx={{ mt: 0.5 }}
                    >
                        {otherUserName}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default MessageBubble;