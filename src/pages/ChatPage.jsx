// import React, { useState, useEffect, useRef } from 'react';
// import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
// import { useSelector } from 'react-redux';
// import {
//     AppBar,
//     Toolbar,
//     Box,
//     Typography,
//     IconButton,
//     Avatar,
//     TextField,
//     Divider,
//     CircularProgress,
//     Button,
//     Paper
// } from '@mui/material';
// import {
//     Send as SendIcon,
//     PersonAdd as PersonAddIcon,
//     Menu as MenuIcon,
//     Close as CloseIcon
// } from '@mui/icons-material';
// import { styled } from '@mui/material/styles';
// import { useChatContext } from '../components/chat/ChatContext';
// import ConversationList from '../components/chat/ConversationList';
// import NewConversationDialog from '../components/chat/NewConversationDialog';

// const ChatContainer = styled(Box)({
//     display: 'flex',
//     height: 'calc(100vh - 64px)',
//     backgroundColor: '#E0F7FA',
//     borderRadius: '16px',
//     overflow: 'hidden',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//     margin: '16px',
//     border: '2px solid #20B2AA'
// });

// const Sidebar = styled(Paper)(({ theme }) => ({
//     width: 300,
//     height: '100%',
//     overflowY: 'auto',
//     borderRadius: '0',
//     backgroundColor: '#FFF8E1',
//     borderRight: '2px solid #FFA726',
//     [theme.breakpoints.down('md')]: {
//         position: 'absolute',
//         zIndex: 1200,
//         width: '80%',
//         transform: 'translateX(0)',
//         transition: 'transform 0.3s ease-in-out',
//         '&.hidden': {
//             transform: 'translateX(-100%)'
//         }
//     },
// }));

// const MainContent = styled(Box)({
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     height: '100%',
//     backgroundColor: '#f5f7fb',
// });

// const MessageArea = styled(Box)({
//     flex: 1,
//     overflowY: 'auto',
//     padding: '16px',
//     display: 'flex',
//     flexDirection: 'column',
//     backgroundColor: '#E0F7FA',
//     backgroundImage: 'linear-gradient(to bottom, #E0F7FA, #B2EBF2)'
// });

// const MessageInputArea = styled(Box)({
//     padding: '16px',
//     borderTop: '2px solid #B2EBF2',
//     backgroundColor: '#FFF8E1',
//     display: 'flex',
//     alignItems: 'center'
// });

// const MessageBubble = styled(Box)(({ iscurrentuser }) => ({
//     maxWidth: '75%',
//     padding: '12px 16px',
//     borderRadius: iscurrentuser ? '16px 0 16px 16px' : '0 16px 16px 16px',
//     marginBottom: '12px',
//     alignSelf: iscurrentuser ? 'flex-end' : 'flex-start',
//     backgroundColor: iscurrentuser ? '#FFECB3' : '#FFFFFF',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//     wordBreak: 'break-word',
//     position: 'relative',
//     border: iscurrentuser ? '1px solid #FFA726' : '1px solid #B2EBF2',
//     fontFamily: "'Tajawal', sans-serif",
//     '&:before': {
//         content: '""',
//         position: 'absolute',
//         width: '0',
//         height: '0',
//         borderStyle: 'solid',
//         borderWidth: iscurrentuser ? '0 0 12px 12px' : '0 12px 12px 0',
//         borderColor: iscurrentuser ? 'transparent transparentrgb(255, 191, 0) transparent' : 'transparent transparentrgb(255, 0, 0) transparent',
//         right: iscurrentuser ? '-8px' : 'auto',
//         left: iscurrentuser ? 'auto' : '-8px',
//         top: '0'
//     }
// }));

// const Timestamp = styled(Typography)({
//     fontSize: '0.7rem',
//     color: '#00695C',
//     marginTop: '4px',
//     textAlign: 'right',
//     fontFamily: "'Tajawal', sans-serif"
// });

// const ConnectionStatus = styled(Box)(({ status }) => ({
//     display: 'flex',
//     alignItems: 'center',
//     padding: '8px 16px',
//     borderRadius: '16px',
//     backgroundColor: status === 'connected' ? '#4caf50' : status === 'connecting' ? '#ff9800' : '#f44336',
//     color: 'white',
//     fontSize: '0.8rem',
//     fontWeight: 'bold',
//     margin: '8px 16px',
//     fontFamily: "'Tajawal', sans-serif"
// }));

// export default function ChatMain() {
//     const user = useSelector(state => state.user);
//     const currentUserId = user.id;
//     const token = user.token;

//     const [connection, setConnection] = useState(null);
//     const [conversations, setConversations] = useState([]);
//     const [selectedConversation, setSelectedConversation] = useState(null);
//     const [newMessage, setNewMessage] = useState('');
//     const [newConversationUserId, setNewConversationUserId] = useState('');
//     const [isNewConversationDialogOpen, setIsNewConversationDialogOpen] = useState(false);
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const [connectionStatus, setConnectionStatus] = useState('disconnected');
//     const [loading, setLoading] = useState(true);
//     const messageEndRef = useRef(null);

//     const { lastSeen, setLastSeen } = useChatContext();

//     // Initialize SignalR connection
//     useEffect(() => {
//         if (!token) return;

//         const newConnection = new HubConnectionBuilder()
//             .withUrl('wss://speech-correction-api.azurewebsites.net/chathub', {
//                 accessTokenFactory: () => token,
//                 skipNegotiation: true,
//                 transport: 1 // WebSockets
//             })
//             .configureLogging(LogLevel.Information)
//             .withAutomaticReconnect()
//             .build();

//         setConnectionStatus('connecting');

//         newConnection.start()
//             .then(() => {
//                 setConnection(newConnection);
//                 setConnectionStatus('connected');
//                 setLoading(false);
//             })
//             .catch(e => {
//                 setConnectionStatus('disconnected');
//             });

//         newConnection.onreconnecting(() => {
//             setConnectionStatus('connecting');
//         });

//         newConnection.onreconnected(() => {
//             setConnectionStatus('connected');
//         });

//         newConnection.onclose(() => {
//             setConnectionStatus('disconnected');
//         });

//         return () => {
//             newConnection.stop();
//         };
//     }, [token]);

//     // Setup SignalR event handlers
//     useEffect(() => {
//         if (!connection) return;

//         connection.on('InitializeConversations', (conversations) => {
//             setConversations(conversations);
//             if (conversations.length > 0 && !selectedConversation) {
//                 setSelectedConversation(conversations[0]);
//             }
//             setLoading(false);
//         });

//         connection.on('ConversationStarted', (conversation) => {
//             setConversations(prev => [...prev, conversation]);
//         });

//         connection.on('ReceiveMessage', (messageContent, conversationId) => {
//             setConversations(prev => prev.map(conv => {
//                 if (conv.id === conversationId) {
//                     const newMessage = {
//                         senderId: currentUserId === conv.user1Id ? conv.user2Id : conv.user1Id,
//                         content: messageContent,
//                         sentAt: new Date().toISOString()
//                     };

//                     const updatedConv = {
//                         ...conv,
//                         messages: [...conv.messages, newMessage],
//                         lastMessageAt: new Date().toISOString()
//                     };

//                     if (selectedConversation?.id === conversationId) {
//                         setSelectedConversation(updatedConv);
//                     }

//                     return updatedConv;
//                 }
//                 return conv;
//             }));
//         });

//         return () => {
//             if (connection) {
//                 connection.off('InitializeConversations');
//                 connection.off('ConversationStarted');
//                 connection.off('ReceiveMessage');
//             }
//         };
//     }, [connection, selectedConversation, currentUserId]);

//     // Scroll to bottom when messages change
//     useEffect(() => {
//         messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [selectedConversation?.messages]);

//     const handleSendMessage = async () => {
//         if (!newMessage.trim() || !selectedConversation || !connection) return;

//         try {
//             await connection.invoke('SendMessage', selectedConversation.id, newMessage);

//             const tempMessage = {
//                 senderId: currentUserId,
//                 content: newMessage,
//                 sentAt: new Date().toISOString()
//             };

//             const updatedConversation = {
//                 ...selectedConversation,
//                 messages: [...selectedConversation.messages, tempMessage],
//                 lastMessageAt: new Date().toISOString()
//             };

//             setConversations(prev => prev.map(conv =>
//                 conv.id === selectedConversation.id ? updatedConversation : conv
//             ));
//             setSelectedConversation(updatedConversation);
//             setNewMessage('');
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const handleStartNewConversation = async () => {
//         if (!newConversationUserId.trim() || !connection) return;

//         try {
//             await connection.invoke('StartConversation', newConversationUserId);
//             setIsNewConversationDialogOpen(false);
//             setNewConversationUserId('');
//         } catch (error) {
//             console.error('Error starting conversation:', error);
//         }
//     };

//     const formatTime = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     if (!token) {
//         return (
//             <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: '100vh',
//                 flexDirection: 'column',
//                 textAlign: 'center',
//                 p: 3
//             }}>
//                 <Typography variant="h5" gutterBottom sx={{ fontFamily: "'Kidzhood Arabic', Arial, sans-serif" }}>
//                     يلزم تسجيل الدخول
//                 </Typography>
//                 <Typography variant="body1" sx={{ mb: 3, fontFamily: "'Tajawal', sans-serif" }}>
//                     يرجى تسجيل الدخول للوصول إلى خدمة المحادثة
//                 </Typography>
//                 <Button
//                     variant="contained"
//                     href="/login"
//                     sx={{
//                         backgroundColor: '#FFA726',
//                         color: 'white',
//                         fontFamily: "'Tajawal', sans-serif",
//                         fontWeight: 'bold'
//                     }}
//                 >
//                     تسجيل الدخول
//                 </Button>
//             </Box>
//         );
//     }

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <CircularProgress size={60} thickness={4} sx={{ color: '#20B2AA' }} />
//             </Box>
//         );
//     }

//     return (
//         <ChatContainer>
//             {/* Sidebar */}
//             <Sidebar className={isSidebarOpen ? '' : 'hidden'}>
//                 <Box sx={{ p: 2, display: 'flex', alignItems: 'center', backgroundColor: '#FFA726', borderBottom: '2px solid #E65100' }}>
//                     <Typography variant="h6" sx={{ flexGrow: 1, color: 'white', fontFamily: "'Kidzhood Arabic', Arial, sans-serif", fontWeight: 'bold' }}>
//                         المحادثات
//                     </Typography>
//                     <IconButton
//                         onClick={() => setIsNewConversationDialogOpen(true)}
//                         color="inherit"
//                     >
//                         <PersonAddIcon sx={{ color: 'white' }} />
//                     </IconButton>
//                     <IconButton
//                         onClick={() => setIsSidebarOpen(false)}
//                         sx={{ display: { md: 'none' }, color: 'white' }}
//                     >
//                         <CloseIcon />
//                     </IconButton>
//                 </Box>

//                 <Divider sx={{ borderColor: '#E65100' }} />

//                 <ConnectionStatus 
//                     status={connectionStatus} 
//                     userName={`${user.firstName} ${user.lastName}`} 
//                 />
                
//                 <Divider sx={{ borderColor: '#E65100' }} />

//                 <ConversationList
//                     conversations={conversations}
//                     currentUserId={currentUserId}
//                     selectedConversation={selectedConversation}
//                     setSelectedConversation={setSelectedConversation}
//                     setIsSidebarOpen={setIsSidebarOpen}
//                     setIsNewConversationDialogOpen={setIsNewConversationDialogOpen}
//                     lastSeen={lastSeen}
//                 />
//             </Sidebar>

//             {/* Main Chat Area */}
//             <MainContent>
//                 <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: '#FFA726', borderBottom: '2px solid #E65100' }}>
//                     <Toolbar>
//                         <IconButton
//                             edge="start"
//                             color="inherit"
//                             aria-label="menu"
//                             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                             sx={{ mr: 2, display: { md: 'none' } }}
//                         >
//                             {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
//                         </IconButton>
//                         {selectedConversation ? (
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                 <Avatar
//                                     alt={selectedConversation.receiverDisplayName}
//                                     src={selectedConversation.receiverProfileImage}
//                                     sx={{ 
//                                         mr: 2, 
//                                         bgcolor: '#20B2AA',
//                                         width: 40,
//                                         height: 40,
//                                         border: '2px solid white'
//                                     }}
//                                 >
//                                     {selectedConversation.receiverDisplayName?.charAt(0) || 'U'}
//                                 </Avatar>
//                                 <Typography variant="h6" noWrap sx={{ color: 'white', fontFamily: "'Kidzhood Arabic', Arial, sans-serif", fontWeight: 'bold' }}>
//                                     {selectedConversation.receiverDisplayName ||
//                                         `User ${selectedConversation.user1Id === currentUserId
//                                             ? selectedConversation.user2Id
//                                             : selectedConversation.user1Id}`}
//                                 </Typography>
//                             </Box>
//                         ) : (
//                             <Typography variant="h6" sx={{ color: 'white', fontFamily: "'Kidzhood Arabic', Arial, sans-serif", fontWeight: 'bold' }}>محادثات التطبيق</Typography>
//                         )}
//                     </Toolbar>
//                 </AppBar>

//                 {/* Message Display Area */}
//                 <MessageArea>
//                     {selectedConversation ? (
//                         <>
//                             {selectedConversation.messages.length === 0 ? (
//                                 <Box sx={{
//                                     display: 'flex',
//                                     flex: 1,
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     textAlign: 'center',
//                                     p: 3,
//                                     flexDirection: 'column'
//                                 }}>
//                                     <Avatar
//                                         alt={selectedConversation.receiverDisplayName}
//                                         src={selectedConversation.receiverProfileImage}
//                                         sx={{ 
//                                             width: 80, 
//                                             height: 80, 
//                                             mb: 2, 
//                                             bgcolor: '#20B2AA',
//                                             border: '3px solid #FFA726'
//                                         }}
//                                     >
//                                         {selectedConversation.receiverDisplayName?.charAt(0) || 'U'}
//                                     </Avatar>
//                                     <Typography variant="h5" gutterBottom sx={{ fontFamily: "'Kidzhood Arabic', Arial, sans-serif", color: '#00695C' }}>
//                                         {selectedConversation.receiverDisplayName ||
//                                             `User ${selectedConversation.user1Id === currentUserId
//                                                 ? selectedConversation.user2Id
//                                                 : selectedConversation.user1Id}`}
//                                     </Typography>
//                                     <Typography variant="body1" sx={{ color: '#00695C', fontFamily: "'Tajawal', sans-serif" }}>
//                                         هذه بداية محادثتك مع هذا المستخدم
//                                     </Typography>
//                                 </Box>
//                             ) : (
//                                 selectedConversation.messages.map((message, index) => {
//                                     const isCurrentUser = message.senderId === currentUserId;
//                                     const showDate = index === 0 ||
//                                         new Date(message.sentAt).toDateString() !==
//                                         new Date(selectedConversation.messages[index - 1].sentAt).toDateString();

//                                     return (
//                                         <React.Fragment key={index}>
//                                             {showDate && (
//                                                 <Box sx={{
//                                                     alignSelf: 'center',
//                                                     my: 2,
//                                                     px: 2,
//                                                     py: 1,
//                                                     bgcolor: '#FFECB3',
//                                                     borderRadius: '16px',
//                                                     border: '1px solid #FFA726'
//                                                 }}>
//                                                     <Typography variant="caption" sx={{ fontFamily: "'Tajawal', sans-serif", color: '#E65100' }}>
//                                                         {new Date(message.sentAt).toLocaleDateString([], {
//                                                             weekday: 'long',
//                                                             year: 'numeric',
//                                                             month: 'long',
//                                                             day: 'numeric'
//                                                         })}
//                                                     </Typography>
//                                                 </Box>
//                                             )}
//                                             <MessageBubble iscurrentuser={isCurrentUser}>
//                                                 <Typography sx={{ fontFamily: "'Tajawal', sans-serif" }}>{message.content}</Typography>
//                                                 <Timestamp>{formatTime(message.sentAt)}</Timestamp>
//                                             </MessageBubble>
//                                         </React.Fragment>
//                                     );
//                                 })
//                             )}
//                             <div ref={messageEndRef} />
//                         </>
//                     ) : (
//                         <Box sx={{
//                             display: 'flex',
//                             flex: 1,
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             textAlign: 'center',
//                             p: 3
//                         }}>
//                             <Box>
//                                 <Typography variant="h5" gutterBottom sx={{ fontFamily: "'Kidzhood Arabic', Arial, sans-serif", color: '#00695C' }}>
//                                     مرحبًا بكم في محادثات التطبيق
//                                 </Typography>
//                                 <Typography variant="body1" sx={{ color: '#00695C', fontFamily: "'Tajawal', sans-serif", mb: 3 }}>
//                                     {conversations.length > 0
//                                         ? "اختر محادثة من القائمة الجانبية لبدء الدردشة"
//                                         : "ابدأ محادثة جديدة بالضغط على زر الإضافة"}
//                                 </Typography>
//                                 <Button
//                                     variant="contained"
//                                     startIcon={<PersonAddIcon />}
//                                     onClick={() => setIsNewConversationDialogOpen(true)}
//                                     sx={{ 
//                                         mt: 2,
//                                         backgroundColor: '#FFA726',
//                                         color: 'white',
//                                         fontFamily: "'Tajawal', sans-serif",
//                                         fontWeight: 'bold',
//                                         '&:hover': {
//                                             backgroundColor: '#E65100'
//                                         }
//                                     }}
//                                 >
//                                     بدء محادثة جديدة
//                                 </Button>
//                             </Box>
//                         </Box>
//                     )}
//                 </MessageArea>

//                 {/* Message Input */}
//                 {selectedConversation && (
//                     <MessageInputArea>
//                         <TextField
//                             fullWidth
//                             variant="outlined"
//                             placeholder="اكتب رسالة هنا..."
//                             value={newMessage}
//                             onChange={(e) => setNewMessage(e.target.value)}
//                             onKeyDown={(e) => {
//                                 if (e.key === 'Enter' && !e.shiftKey) {
//                                     e.preventDefault();
//                                     handleSendMessage();
//                                 }
//                             }}
//                             multiline
//                             maxRows={4}
//                             sx={{ 
//                                 mr: 1,
//                                 '& .MuiOutlinedInput-root': {
//                                     borderRadius: '16px',
//                                     fontFamily: "'Tajawal', sans-serif",
//                                     backgroundColor: 'white'
//                                 }
//                             }}
//                         />
//                         <IconButton
//                             color="primary"
//                             onClick={handleSendMessage}
//                             disabled={!newMessage.trim()}
//                             sx={{ 
//                                 alignSelf: 'flex-end',
//                                 mb: 1,
//                                 backgroundColor: '#20B2AA',
//                                 color: 'white',
//                                 '&:hover': {
//                                     backgroundColor: '#00897B'
//                                 },
//                                 '&:disabled': {
//                                     backgroundColor: '#B2DFDB'
//                                 }
//                             }}
//                         >
//                             <SendIcon />
//                         </IconButton>
//                     </MessageInputArea>
//                 )}
//             </MainContent>

//             {/* New Conversation Dialog */}
//             <NewConversationDialog
//                 open={isNewConversationDialogOpen}
//                 onClose={() => setIsNewConversationDialogOpen(false)}
//                 newConversationUserId={newConversationUserId}
//                 setNewConversationUserId={setNewConversationUserId}
//                 handleStartNewConversation={handleStartNewConversation}
//             />
//         </ChatContainer>
//     );
// }