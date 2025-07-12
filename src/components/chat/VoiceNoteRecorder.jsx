import React, { useState, useRef } from 'react';
import { IconButton, Tooltip, CircularProgress, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';

const VoiceRecorder = ({ onSendAudio, disabled }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // بدء التسجيل
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };
            
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setAudioBlob(blob);
            };
            
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('لا يمكن الوصول إلى الميكروفون');
        }
    };

    // إيقاف التسجيل
    const stopRecording = () => {
        if (mediaRecorderRef.current?.state !== 'inactive') {
            mediaRecorderRef.current?.stop();
            mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    // إرسال التسجيل
    const handleSend = async () => {
        if (!audioBlob) return;
        
        setIsSending(true);
        try {
            await onSendAudio(audioBlob);
            setAudioBlob(null);
        } catch (error) {
            console.error('Error sending audio:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            p: 1,
            bgcolor: 'background.paper',
            borderRadius: 2
        }}>
            {!audioBlob ? (
                <>
                    <Tooltip title={isRecording ? "إيقاف التسجيل" : "بدء التسجيل"}>
                        <IconButton 
                            onClick={isRecording ? stopRecording : startRecording}
                            color={isRecording ? "error" : "primary"}
                            disabled={disabled}
                        >
                            {isRecording ? <StopIcon /> : <MicIcon />}
                        </IconButton>
                    </Tooltip>
                    
                    {isRecording && (
                        <Box sx={{ 
                            width: 100,
                            height: 8,
                            bgcolor: 'grey.300',
                            borderRadius: 4,
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                bgcolor: 'error.main',
                                animation: 'pulse 1.5s infinite',
                                '@keyframes pulse': {
                                    '0%': { opacity: 0.6 },
                                    '50%': { opacity: 1 },
                                    '100%': { opacity: 0.6 }
                                }
                            }} />
                        </Box>
                    )}
                </>
            ) : (
                <>
                    <audio 
                        controls 
                        src={URL.createObjectURL(audioBlob)} 
                        style={{ maxWidth: 200 }}
                    />
                    <Tooltip title="إرسال التسجيل">
                        <IconButton 
                            onClick={handleSend}
                            disabled={isSending || disabled}
                            color="primary"
                        >
                            {isSending ? (
                                <CircularProgress size={24} />
                            ) : (
                                <SendIcon />
                            )}
                        </IconButton>
                    </Tooltip>
                </>
            )}
        </Box>
    );
};

export default VoiceRecorder;