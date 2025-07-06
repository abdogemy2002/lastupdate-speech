import React from 'react';
import { Box, Avatar, IconButton, Typography } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChatHeader = ({ isMobile, selectedConversation, handleBack, currentUserId, getOtherUser }) => {
    return (
        <Box sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: 'white'
        }}>
            {isMobile && (
                <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
            )}
            <Avatar sx={{
                bgcolor: deepOrange[500],
                mr: 2,
                color: 'white'
            }}>
                {getOtherUser(selectedConversation)?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
                {getOtherUser(selectedConversation) || 'مستخدم غير معروف'}
            </Typography>
        </Box>
    );
};

export default ChatHeader;