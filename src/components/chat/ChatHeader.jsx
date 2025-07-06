import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Box,
    IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const ChatHeader = ({
    selectedConversation,
    currentUserId,
    setIsSidebarOpen
}) => (
    <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setIsSidebarOpen(true)}
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            {selectedConversation ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        alt={selectedConversation.receiverDisplayName}
                        src={selectedConversation.receiverProfileImage || undefined}
                        sx={{ mr: 2, bgcolor: '#3f51b5' }}
                    >
                        {selectedConversation.receiverDisplayName?.charAt(0) || 'U'}
                    </Avatar>
                    <Typography variant="h6" noWrap>
                        {selectedConversation.receiverDisplayName ||
                            `User ${selectedConversation.user1Id === currentUserId
                                ? selectedConversation.user2Id
                                : selectedConversation.user1Id}`}
                    </Typography>
                </Box>
            ) : (
                <Typography variant="h6">Speech Correction Chat</Typography>
            )}
        </Toolbar>
    </AppBar>
);

export default ChatHeader;