import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useSelector } from 'react-redux';
import {
    Box,
    Paper,
    IconButton,
    CircularProgress,
    Typography,
    Button
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Close as CloseIcon
} from '@mui/icons-material';

// المكونات الفرعية
import ConnectionStatus from './components/ConnectionStatus';
import MessageBubble from './components/MessageBubble';
import MessageInput from './components/MessageInput';
import NewConversationDialog from './components/NewConversationDialog';
import ConversationList from './components/ConversationList';
import ChatHeader from './components/ChatHeader';

// الأنماط
import {
    ChatContainer,
    Sidebar,
    MainContent,
    MessageArea,
    MessageInputArea
} from './styles/chatStyles';

// الأدوات المساعدة
import { formatFullDate } from './utils/dateUtils';

export default function ChatMain() {
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
                        return 2000;
                    }
                    return 5000;
                }
            })
            .build();

        setConnectionStatus('connecting');

        newConnection.start()
            .then(() => {
                setConnection(newConnection);
                setConnectionStatus('connected');
                setLoading(false);
            })
            .catch(e => {
                setConnectionStatus('disconnected');
            });

        newConnection.onreconnecting(() => {
            setConnectionStatus('connecting');
        });

        newConnection.onreconnected(() => {
            setConnectionStatus('connected');
        });

        newConnection.onclose(() => {
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

            const tempMessage = {
                senderId: currentUserId,
                content: newMessage,
                sentAt: new Date().toISOString()
            };

            const updatedConversation = {
                ...selectedConversation,
                messages: [...selectedConversation.messages, tempMessage],
                lastMessageAt: new Date().toISOString()
            };

            setConversations(prev => prev.map(conv =>
                conv.id === selectedConversation.id ? updatedConversation : conv
            ));

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

                <ConnectionStatus
                    status={connectionStatus}
                    userName={`${user.firstName} ${user.lastName}`}
                />
                <Divider />

                <ConversationList
                    conversations={conversations}
                    currentUserId={currentUserId}
                    selectedConversation={selectedConversation}
                    setSelectedConversation={setSelectedConversation}
                    setIsSidebarOpen={setIsSidebarOpen}
                    setIsNewConversationDialogOpen={setIsNewConversationDialogOpen}
                />
            </Sidebar>

            {/* Main Chat Area */}
            <MainContent>
                <ChatHeader
                    selectedConversation={selectedConversation}
                    currentUserId={currentUserId}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

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
                                                        {formatFullDate(message.sentAt)}
                                                    </Typography>
                                                </Box>
                                            )}
                                            <MessageBubble
                                                isCurrentUser={isCurrentUser}
                                                content={message.content}
                                                sentAt={message.sentAt}
                                            />
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
                        <MessageInput
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            handleSendMessage={handleSendMessage}
                        />
                    </MessageInputArea>
                )}
            </MainContent>

            {/* New Conversation Dialog */}
            <NewConversationDialog
                open={isNewConversationDialogOpen}
                onClose={() => setIsNewConversationDialogOpen(false)}
                newConversationUserId={newConversationUserId}
                setNewConversationUserId={setNewConversationUserId}
                handleStartNewConversation={handleStartNewConversation}
            />
        </ChatContainer>
    );
}