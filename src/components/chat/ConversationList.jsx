import React from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Badge,
    CircularProgress
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ConversationList = ({
    isMobile,
    conversations = [],
    loading,
    error,
    selectedConversation,
    handleSelectConversation,
    handleBack,
    handleOpenNewConversationDialog,
    currentUserId,
    getOtherUser,
    formatTime
}) => {
    return (
        <Box sx={{
            width: isMobile ? '100%' : 350,
            borderRight: '1px solid #e0e0e0',
            display: isMobile && selectedConversation ? 'none' : 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <Box sx={{
                p: 2,
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isMobile && (
                        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" fontWeight="bold">المحادثات</Typography>
                </Box>
                <IconButton
                    onClick={handleOpenNewConversationDialog}
                    sx={{ color: '#20B2AA' }}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box sx={{ p: 2 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : conversations.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1">
                        لا توجد محادثات بعد. ابدأ محادثة جديدة!
                    </Typography>
                </Box>
            ) : (
                <List sx={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.map(conv => (
                        <ListItem
                            button
                            key={conv.id}
                            onClick={() => handleSelectConversation(conv)}
                            sx={{
                                backgroundColor: selectedConversation?.id === conv.id ? '#e3f2fd' : 'inherit',
                                '&:hover': { backgroundColor: '#f5f5f5' }
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{
                                    bgcolor: deepPurple[500],
                                    color: 'white'
                                }}>
                                    {getOtherUser(conv)?.charAt(0) || 'U'}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={getOtherUser(conv) || 'مستخدم غير معروف'}
                                secondary={conv.lastMessage ? `${conv.lastMessage.substring(0, 30)}... • ${formatTime(conv.lastMessageTime)}` : 'بدء المحادثة...'}
                                secondaryTypographyProps={{
                                    noWrap: true,
                                    style: {
                                        fontSize: '0.8rem',
                                        color: '#666'
                                    }
                                }}
                                primaryTypographyProps={{
                                    style: {
                                        fontWeight: 'bold',
                                        fontSize: '0.95rem'
                                    }
                                }}
                            />
                            {conv.unreadCount > 0 && (
                                <Badge
                                    badgeContent={conv.unreadCount}
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                            )}
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default ConversationList;