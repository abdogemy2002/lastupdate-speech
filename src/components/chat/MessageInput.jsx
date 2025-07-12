import React, { useState, useRef } from 'react';
import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useSelector } from 'react-redux';

const MessageInput = ({
    newMessage,
    setNewMessage,
    handleSendMessage,
    conversationId,
    isSending,
    currentUserId, // 👈 خد الـ prop هنا
    selectedConversation,
    setSelectedConversation,
    setConversations
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isSendingAudio, setIsSendingAudio] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const token = useSelector(state => state.user.token);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('يجب السماح بالوصول إلى الميكروفون');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state !== 'inactive') {
            mediaRecorderRef.current?.stop();
            mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const handleSendAudio = async () => {
        if (!audioBlob || !conversationId || !token) {
            console.log('إرسال الصوت متوقف - بيانات ناقصة:', {
                hasAudioBlob: !!audioBlob,
                hasConversationId: !!conversationId,
                hasToken: !!token
            });
            return;
        }

        setIsSendingAudio(true);
        try {
            const formData = new FormData();
            formData.append('audioRecord', audioBlob, 'voice-note.wav');

            const url = new URL('https://speech-correction-api.azurewebsites.net/api/Conversation/SendAudioMessage');
            url.searchParams.append('conversationId', conversationId);

            console.log('إرسال بيانات الصوت:', {
                size: `${(audioBlob.size / 1024).toFixed(2)} KB`,
                type: audioBlob.type
            });

            const response = await fetch(url.toString(), {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('حالة الاستجابة:', response.status, response.statusText);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.text(); // حاول قراءة النص أولاً
                    errorData = JSON.parse(errorData); // ثم حاول تحويله لـ JSON
                } catch (e) {
                    console.error('فشل تحليل استجابة الخطأ:', e);
                    errorData = { message: await response.text() };
                }
                throw new Error(errorData.message || 'فشل إرسال التسجيل الصوتي');
            }

            // Append الصوت للمحادثة مباشرة بعد الإرسال
            const now = new Date().toISOString();
            const newAudioMessage = {
                senderId: currentUserId,
                content: "رسالة صوتية",
                sentAt: now,
                audioUrl: `https://speech-correction-api.azurewebsites.net//AudioMessage/${conversationId}.wav`, // تأكد من إنه نفس الرابط اللي فعلاً بيوصلك أو حط رابط صحيح من الباك
                type: 1
            };

            // Update selectedConversation locally
            const updatedConversation = {
                ...selectedConversation,
                messages: [...selectedConversation.messages, newAudioMessage],
                lastMessageAt: now
            };

            setSelectedConversation(updatedConversation);
            setConversations(prev =>
                prev.map(conv =>
                    conv.id === conversationId ? updatedConversation : conv
                )
            );

            setAudioBlob(null);
            console.log('✅ تم إرسال التسجيل الصوتي وتحديث الواجهة بنجاح');
        } catch (error) {
            console.error('❌ تفاصيل الخطأ:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            alert(`حدث خطأ أثناء إرسال التسجيل: ${error.message}`);
        } finally {
            setIsSendingAudio(false);
        }
    };


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 1,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
        }}>
            {audioBlob ? (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    bgcolor: 'grey.100',
                    borderRadius: 2
                }}>
                    <audio
                        controls
                        src={URL.createObjectURL(audioBlob)}
                        style={{ flexGrow: 1, maxWidth: 'calc(100% - 48px)' }}
                    />
                    <IconButton
                        onClick={handleSendAudio}
                        disabled={isSendingAudio}
                        color="primary"
                    >
                        {isSendingAudio ? <CircularProgress size={24} /> : <SendIcon />}
                    </IconButton>
                </Box>
            ) : (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <IconButton
                        onClick={isRecording ? stopRecording : startRecording}
                        color={isRecording ? "error" : "primary"}
                        disabled={isSending || isSendingAudio}
                    >
                        {isRecording ? <StopIcon /> : <MicIcon />}
                    </IconButton>

                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="اكتب رسالتك..."
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
                        disabled={isSending || isSendingAudio}
                    />

                    <IconButton
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending || isSendingAudio}
                        color="primary"
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default MessageInput;