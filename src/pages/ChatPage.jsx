import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {
    AppBar, Toolbar, Typography,
    List, ListItem, ListItemText,
    Avatar, Badge, TextField,
    Button, IconButton, Paper,
    Box, Divider, Drawer,
    Dialog, DialogTitle, DialogContent,
    DialogActions, ListItemAvatar,
    CircularProgress
} from '@mui/material';
import {
    Send as SendIcon,
    PersonAdd as PersonAddIcon,
    Menu as MenuIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const ChatContainer = styled(Box)({
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f7fb',
});

const Sidebar = styled(Paper)({
    width: 300,
    height: '100%',
    overflowY: 'auto',
    borderRadius: 0,
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    '@media (max-width: 768px)': {
        width: '100%',
    },
});

const MainContent = styled(Box)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
});

const MessageArea = styled(Box)({
    flex: 1,
    overflowY: 'auto',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f2f5',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
});

const MessageInputArea = styled(Box)({
    padding: 16,
    borderTop: '1px solid #e0e0e0',
    backgroundColor: 'white',
});

const MessageBubble = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'iscurrentuser',
})(({ iscurrentuser }) => ({
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: '18px',
    marginBottom: '12px',
    alignSelf: iscurrentuser ? 'flex-end' : 'flex-start',
    backgroundColor: iscurrentuser ? '#dcf8c6' : 'white',
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
    wordBreak: 'break-word',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderColor: iscurrentuser
            ? 'transparent transparent #dcf8c6 transparent'
            : 'transparent transparent white transparent',
        borderWidth: iscurrentuser
            ? '0 0 12px 12px'
            : '0 12px 12px 0',
        right: iscurrentuser ? '-8px' : 'auto',
        left: iscurrentuser ? 'auto' : '-8px',
        transform: iscurrentuser ? 'rotate(-20deg)' : 'rotate(20deg)'
    }
}));


const Timestamp = styled(Typography)({
    fontSize: '0.7rem',
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
});

const ConnectionStatus = styled(Box)(({ status }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: 20,
    backgroundColor: status === 'connected' ? '#4caf50' : status === 'connecting' ? '#ff9800' : '#f44336',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 500,
    marginRight: 16,
}));

const StatusDot = styled(Box)({
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 6,
});

export default function ChatComponent() {
    const user = useSelector(state => state.user);
    const currentUserId = user.id;
    const token = user.token;

    const [connection, setConnection] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [newConversationUserId, setNewConversationUserId] = useState('');
    const [isNewConversationDialogOpen, setIsNewConversationDialogOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [loading, setLoading] = useState(true);
    const messageEndRef = useRef(null);

    // Initialize SignalR connection
    useEffect(() => {
        if (!token) return;

        const newConnection = new HubConnectionBuilder()
            .withUrl('wss://speech-correction-api.azurewebsites.net/chathub', {
                accessTokenFactory: () => token,
                skipNegotiation: true,
                transport: 1 // WebSockets
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: retryContext => {
                    if (retryContext.elapsedMilliseconds < 60000) {
                        return 2000; // Retry every 2 seconds for the first minute
                    }
                    return 5000; // Then every 5 seconds
                }
            })
            .build();

        setConnectionStatus('connecting');

        newConnection.start()
            .then(() => {
                console.log('SignalR Connected!');
                setConnection(newConnection);
                setConnectionStatus('connected');
                setLoading(false);
            })
            .catch(e => {
                console.log('Connection failed: ', e);
                setConnectionStatus('disconnected');
            });

        newConnection.onreconnecting(error => {
            console.log('Connection lost. Reconnecting...', error);
            setConnectionStatus('connecting');
        });

        newConnection.onreconnected(connectionId => {
            console.log('Reconnected successfully');
            setConnectionStatus('connected');
        });

        newConnection.onclose(error => {
            console.log('Connection closed', error);
            setConnectionStatus('disconnected');
        });

        return () => {
            newConnection.stop();
        };
    }, [token]);

    // Setup SignalR event handlers
    useEffect(() => {
        if (!connection) return;

        connection.on('InitializeConversations', (conversations) => {
            setConversations(conversations);
            if (conversations.length > 0 && !selectedConversation) {
                setSelectedConversation(conversations[0]);
            }
            setLoading(false);
        });

        connection.on('ConversationStarted', (conversation) => {
            setConversations(prev => {
                const exists = prev.some(c => c.id === conversation.id);
                if (!exists) {
                    return [...prev, conversation];
                }
                return prev;
            });
        });

        connection.on('ReceiveMessage', (messageContent, conversationId) => {
            setConversations(prev => prev.map(conv => {
                if (conv.id === conversationId) {
                    const newMessage = {
                        senderId: currentUserId === conv.user1Id ? conv.user2Id : conv.user1Id,
                        content: messageContent,
                        sentAt: new Date().toISOString()
                    };

                    const updatedConv = {
                        ...conv,
                        messages: [...conv.messages, newMessage],
                        lastMessageAt: new Date().toISOString()
                    };

                    // If this is the selected conversation, update it too
                    if (selectedConversation?.id === conversationId) {
                        setSelectedConversation(updatedConv);
                    }

                    return updatedConv;
                }
                return conv;
            }));
        });

        return () => {
            if (connection) {
                connection.off('InitializeConversations');
                connection.off('ConversationStarted');
                connection.off('ReceiveMessage');
            }
        };
    }, [connection, selectedConversation, currentUserId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !connection) return;

        try {
            await connection.invoke('SendMessage', selectedConversation.id, newMessage);

            // Optimistically update UI
            const tempMessage = {
                senderId: currentUserId,
                content: newMessage,
                sentAt: new Date().toISOString()
            };

            // Create a new updated conversation object
            const updatedConversation = {
                ...selectedConversation,
                messages: [...selectedConversation.messages, tempMessage],
                lastMessageAt: new Date().toISOString()
            };

            // Update both conversations list and selected conversation
            setConversations(prev => prev.map(conv =>
                conv.id === selectedConversation.id ? updatedConversation : conv
            ));

            // Update the selected conversation directly
            setSelectedConversation(updatedConversation);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    const handleStartNewConversation = async () => {
        if (!newConversationUserId.trim() || !connection) return;

        try {
            await connection.invoke('StartConversation', newConversationUserId);
            setIsNewConversationDialogOpen(false);
            setNewConversationUserId('');
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const isToday = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    if (!token) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                textAlign: 'center',
                p: 3
            }}>
                <Typography variant="h5" gutterBottom>
                    Authentication Required
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                    Please log in to access the chat feature
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    href="/login"
                >
                    Go to Login
                </Button>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <ChatContainer>
            {/* Sidebar */}
            <Sidebar sx={{ display: { xs: isSidebarOpen ? 'block' : 'none', md: 'block' } }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Conversations</Typography>
                    <IconButton
                        onClick={() => setIsNewConversationDialogOpen(true)}
                        color="primary"
                    >
                        <PersonAddIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => setIsSidebarOpen(false)}
                        sx={{ display: { md: 'none' } }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider />

                {/* Connection Status */}
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <ConnectionStatus status={connectionStatus}>
                        <StatusDot />
                        {connectionStatus === 'connected' ? 'Connected' :
                            connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                    </ConnectionStatus>
                    <Typography variant="body2" color="textSecondary">
                        {user.firstName} {user.lastName}
                    </Typography>
                </Box>
                <Divider />

                {/* Conversation list */}
                <List sx={{ overflowY: 'auto', flex: 1 }}>
                    {conversations.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body1" color="textSecondary">
                                No conversations yet
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<PersonAddIcon />}
                                onClick={() => setIsNewConversationDialogOpen(true)}
                                sx={{ mt: 2 }}
                            >
                                Start a Conversation
                            </Button>
                        </Box>
                    ) : (
                        conversations.map(conversation => {
                            const otherUser = conversation.user1Id === currentUserId
                                ? conversation.user2Id
                                : conversation.user1Id;

                            const lastMessage = conversation.messages[conversation.messages.length - 1];
                            const unreadCount = conversation.messages.filter(
                                m => m.senderId !== currentUserId && !m.readAt
                            ).length;

                            return (
                                <ListItem
                                    key={conversation.id}
                                    button
                                    selected={selectedConversation?.id === conversation.id}
                                    onClick={() => {
                                        setSelectedConversation(conversation);
                                        setIsSidebarOpen(false);
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Badge
                                            badgeContent={unreadCount}
                                            color="primary"
                                            invisible={unreadCount === 0}
                                        >
                                            <Avatar
                                                alt={conversation.receiverDisplayName}
                                                src={conversation.receiverProfileImage || undefined}
                                                sx={{ bgcolor: '#3f51b5' }}
                                            >
                                                {conversation.receiverDisplayName?.charAt(0) || 'U'}
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={conversation.receiverDisplayName || `User ${otherUser}`}
                                        secondary={lastMessage?.content || 'No messages yet'}
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
                                        <Typography variant="caption">
                                            {conversation.lastMessageAt &&
                                                (isToday(conversation.lastMessageAt)
                                                    ? formatTime(conversation.lastMessageAt)
                                                    : formatDate(conversation.lastMessageAt))}
                                        </Typography>
                                        {unreadCount > 0 && (
                                            <Box sx={{
                                                bgcolor: 'primary.main',
                                                borderRadius: '50%',
                                                width: 20,
                                                height: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: 0.5
                                            }}>
                                                <Typography variant="caption" sx={{ color: 'white' }}>
                                                    {unreadCount}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </ListItem>
                            );
                        })
                    )}
                </List>
            </Sidebar>

            {/* Main Chat Area */}
            <MainContent>
                <AppBar position="static" color="default" elevation={1}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => setIsSidebarOpen(true)}
                            sx={{ mr: 2, display: { md: 'none' } }}
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

                {/* Message Display Area */}
                <MessageArea>
                    {selectedConversation ? (
                        <>
                            {selectedConversation.messages.length === 0 ? (
                                <Box sx={{
                                    display: 'flex',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    p: 3,
                                    flexDirection: 'column'
                                }}>
                                    <Avatar
                                        alt={selectedConversation.receiverDisplayName}
                                        src={selectedConversation.receiverProfileImage || undefined}
                                        sx={{ width: 80, height: 80, mb: 2, bgcolor: '#3f51b5' }}
                                    >
                                        {selectedConversation.receiverDisplayName?.charAt(0) || 'U'}
                                    </Avatar>
                                    <Typography variant="h5" gutterBottom>
                                        {selectedConversation.receiverDisplayName ||
                                            `User ${selectedConversation.user1Id === currentUserId
                                                ? selectedConversation.user2Id
                                                : selectedConversation.user1Id}`}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        This is the beginning of your conversation
                                    </Typography>
                                </Box>
                            ) : (
                                selectedConversation.messages.map((message, index) => {
                                    const isCurrentUser = message.senderId === currentUserId;
                                    const showDate = index === 0 ||
                                        new Date(message.sentAt).toDateString() !==
                                        new Date(selectedConversation.messages[index - 1].sentAt).toDateString();

                                    return (
                                        <React.Fragment key={index}>
                                            {showDate && (
                                                <Box sx={{
                                                    alignSelf: 'center',
                                                    my: 2,
                                                    px: 2,
                                                    py: 1,
                                                    bgcolor: 'rgba(0,0,0,0.05)',
                                                    borderRadius: 2
                                                }}>
                                                    <Typography variant="caption">
                                                        {new Date(message.sentAt).toLocaleDateString([], {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </Typography>
                                                </Box>
                                            )}
                                            <MessageBubble iscurrentuser={isCurrentUser}>                                                <Typography>{message.content}</Typography>
                                                <Timestamp>{formatTime(message.sentAt)}</Timestamp>
                                            </MessageBubble>
                                        </React.Fragment>
                                    );
                                })
                            )}
                            <div ref={messageEndRef} />
                        </>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            p: 3
                        }}>
                            <Box>
                                <Typography variant="h5" gutterBottom>
                                    Welcome to Speech Correction Chat
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                                    {conversations.length > 0
                                        ? "Select a conversation from the sidebar to start chatting"
                                        : "Start a new conversation by clicking the '+' button"}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => setIsNewConversationDialogOpen(true)}
                                    sx={{ mt: 2 }}
                                >
                                    Start New Conversation
                                </Button>
                            </Box>
                        </Box>
                    )}
                </MessageArea>

                {/* Message Input */}
                {selectedConversation && (
                    <MessageInputArea>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                multiline
                                maxRows={4}
                                sx={{ mr: 1 }}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                sx={{ alignSelf: 'flex-end', mb: 1 }}
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </MessageInputArea>
                )}
            </MainContent>

            {/* New Conversation Dialog */}
            <Dialog
                open={isNewConversationDialogOpen}
                onClose={() => setIsNewConversationDialogOpen(false)}
            >
                <DialogTitle>Start New Conversation</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2, minWidth: 300 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="User ID"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={newConversationUserId}
                            onChange={(e) => setNewConversationUserId(e.target.value)}
                            placeholder="Enter user ID to start conversation"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsNewConversationDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleStartNewConversation}
                        variant="contained"
                        disabled={!newConversationUserId.trim()}
                    >
                        Start Conversation
                    </Button>
                </DialogActions>
            </Dialog>
        </ChatContainer>
    );
}