import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useSelector } from 'react-redux';
import {
    IconButton,
    CircularProgress,
    Typography,
    Button,
    Avatar,
    Box
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Close as CloseIcon
} from '@mui/icons-material';

// مكونات فرعية
import ConnectionStatus from './ConnectionStatus';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import NewConversationDialog from './NewConversationDialog';
import ConversationList from './ConversationList';
import ChatHeader from './ChatHeader';

// أنماط مفصولة
import {
    ChatContainer,
    Sidebar,
    MainContent,
    MessageArea,
    MessageInputArea,
    CenteredBox,
    EmptyMessageBox,
} from './styles/chatStyles';

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

    useEffect(() => {
        if (!token) return;

        const newConnection = new HubConnectionBuilder()
            .withUrl('wss://speech-correction-api.azurewebsites.net/chathub', {
                accessTokenFactory: () => token,
                skipNegotiation: true,
                transport: 1
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
            .catch(() => {
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

    useEffect(() => {
        if (!connection) return;

        connection.on('InitializeConversations', (convs) => {
            setConversations(convs);
            if (convs.length > 0 && !selectedConversation) {
                setSelectedConversation(convs[0]);
            }
            setLoading(false);
        });

        connection.on('ConversationStarted', (conv) => {
            setConversations(prev => {
                const exists = prev.some(c => c.id === conv.id);
                if (!exists) return [...prev, conv];
                return prev;
            });
        });

        connection.on('ReceiveMessage', (messageContent, conversationId) => {
            setConversations(prev => prev.map(conv => {
                if (conv.id === conversationId) {
                    const newMessageObj = {
                        senderId: currentUserId === conv.user1Id ? conv.user2Id : conv.user1Id,
                        content: messageContent,
                        sentAt: new Date().toISOString()
                    };

                    const updatedConv = {
                        ...conv,
                        messages: [...conv.messages, newMessageObj],
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
            <CenteredBox>
                <Typography variant="h5" gutterBottom>
                    Authentication Required
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                    Please log in to access the chat feature
                </Typography>
                <Button variant="contained" color="primary" href="/login">
                    Go to Login
                </Button>
            </CenteredBox>
        );
    }

    if (loading) {
        return (
            <CenteredBox>
                <CircularProgress size={60} />
            </CenteredBox>
        );
    }

    return (
        <ChatContainer>
            <Sidebar sx={{ display: { xs: isSidebarOpen ? 'block' : 'none', md: 'block' } }}>
                <Box
                    sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#20B2AA',
                        color: '#fff'
                    }}
                >
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        الرسائل
                    </Typography>
                    <IconButton onClick={() => setIsNewConversationDialogOpen(true)} sx={{ color: '#fff' }}>
                        <PersonAddIcon />
                    </IconButton>
                    <IconButton onClick={() => setIsSidebarOpen(false)} sx={{ display: { md: 'none' }, color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <ConnectionStatus
                    status={connectionStatus}
                    userName={`${user.firstName} ${user.lastName}`}
                />

                <ConversationList
                    conversations={conversations}
                    currentUserId={currentUserId}
                    selectedConversation={selectedConversation}
                    setSelectedConversation={setSelectedConversation}
                    setIsSidebarOpen={setIsSidebarOpen}
                    setIsNewConversationDialogOpen={setIsNewConversationDialogOpen}
                />
            </Sidebar>

            <MainContent>
                <ChatHeader
                    selectedConversation={selectedConversation}
                    currentUserId={currentUserId}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                <MessageArea>
                    {selectedConversation ? (
                        <>
                            {selectedConversation.messages.length === 0 ? (
                                <EmptyMessageBox>
                                    <Avatar
                                        alt={selectedConversation.receiverDisplayName}
                                        src={selectedConversation.receiverProfileImage || undefined}
                                        sx={{ width: 80, height: 80, mb: 2, bgcolor: '#FFA726', color: '#fff', fontSize: 32 }}
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
                                        هذه هي بداية المحادثة
                                    </Typography>
                                </EmptyMessageBox>
                            ) : (
                                selectedConversation.messages.map((message, index) => {
                                    const isCurrentUser = message.senderId === currentUserId;
                                    const showDate =
                                        index === 0 ||
                                        new Date(message.sentAt).toDateString() !==
                                        new Date(selectedConversation.messages[index - 1].sentAt).toDateString();

                                    return (
                                        <React.Fragment key={index}>
                                            <MessageBubble
                                                isCurrentUser={isCurrentUser}
                                                content={message.content}
                                                sentAt={message.sentAt}
                                                showDate={showDate}
                                                dateString={formatFullDate(message.sentAt)}
                                            />
                                        </React.Fragment>
                                    );
                                })
                            )}
                            <div ref={messageEndRef} />
                        </>
                    ) : (
                        <EmptyMessageBox>
                            <Box>
                                <Typography variant="h5" gutterBottom>
                                    مرحبًا بك في المحادثات
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                                    {conversations.length > 0
                                        ? 'اختر محادثة من القائمة الجانبية'
                                        : 'ابدأ محادثة جديدة بالضغط على زر +'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: '#FFA726', '&:hover': { backgroundColor: '#fb8c00' } }}
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => setIsNewConversationDialogOpen(true)}
                                >
                                    محادثة جديدة
                                </Button>
                            </Box>
                        </EmptyMessageBox>
                    )}
                </MessageArea>

                {selectedConversation && (
                    <MessageInputArea sx={{ position: 'sticky', bottom: 0, zIndex: 1 }}>
                        <MessageInput
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            handleSendMessage={handleSendMessage}
                        />
                    </MessageInputArea>
                )}
            </MainContent>

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
