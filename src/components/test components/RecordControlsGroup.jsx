import React, { useState, useRef, useEffect } from 'react';
import { styled, Box, IconButton, Slider } from '@mui/material';
import {
    Replay as ReplayIcon,
    PlayArrow as PlayArrowIcon,
    Pause as PauseIcon,
    Bookmark as BookmarkIcon,
    Mic as MicIcon,
    Stop as StopIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Styled Components
const MicCircle = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isRecording',
})(({ theme, isRecording }) => ({
    backgroundColor: 'white',
    width: '120px',
    aspectRatio: '1 / 1',
    marginLeft: '15px',
    marginBottom: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    flexShrink: 0,
    position: 'relative',
    boxShadow: isRecording ? '0 0 0 0 rgba(255, 0, 0, 0.7)' : '0 0 0 0 rgba(252, 164, 60, 0.7)',
    animation: isRecording ? 'pulseRed 1.5s infinite' : 'pulse 1.5s infinite',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: isRecording ? '0 0 0 10px rgba(255, 0, 0, 0)' : '0 0 0 10px rgba(252, 164, 60, 0)',
    },
    '& svg': {
        position: 'relative',
        zIndex: 2,
    },
    '@keyframes pulse': {
        '0%': {
            boxShadow: '0 0 0 0 rgba(252, 164, 60, 0.7)',
        },
        '70%': {
            boxShadow: '0 0 0 15px rgba(252, 164, 60, 0)',
        },
        '100%': {
            boxShadow: '0 0 0 0 rgba(252, 164, 60, 0)',
        },
    },
    '@keyframes pulseRed': {
        '0%': {
            boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.7)',
        },
        '70%': {
            boxShadow: '0 0 0 15px rgba(255, 0, 0, 0)',
        },
        '100%': {
            boxShadow: '0 0 0 0 rgba(255, 0, 0, 0)',
        },
    },
    [theme.breakpoints.down('sm')]: {
        width: '80px',
        height: '80px',
        '@keyframes pulse': {
            '0%': {
                boxShadow: '0 0 0 0 rgba(252, 164, 60, 0.7)',
            },
            '70%': {
                boxShadow: '0 0 0 10px rgba(252, 164, 60, 0)',
            },
            '100%': {
                boxShadow: '0 0 0 0 rgba(252, 164, 60, 0)',
            },
        },
        '@keyframes pulseRed': {
            '0%': {
                boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.7)',
            },
            '70%': {
                boxShadow: '0 0 0 10px rgba(255, 0, 0, 0)',
            },
            '100%': {
                boxShadow: '0 0 0 0 rgba(255, 0, 0, 0)',
            },
        }
    }
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '95%',
    backgroundColor: 'rgb(255, 255, 255)',
    backdropFilter: 'blur(5px)',
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const SeekBar = styled(Slider)(({ theme }) => ({
    color: '#FCA43C',
    height: 4,
    padding: '10px 0',
    '& .MuiSlider-rail': {
        opacity: 0.3,
        backgroundColor: 'rgba(252, 166, 60, 0.49)',
    },
    '& .MuiSlider-track': {
        transition: 'width 0.1s linear',
    },
    '& .MuiSlider-thumb': {
        width: 12,
        height: 12,
        backgroundColor: '#FCA43C',
        boxShadow: 'none',
        transition: 'all 0.1s ease',
        '&:hover, &.Mui-focusVisible': {
            boxShadow: '0 0 0 6px rgba(252, 166, 60, 0.49)',
            width: 14,
            height: 14,
        },
        '&.Mui-active': {
            width: 16,
            height: 16,
        },
    },
}));

// Main Component
const RecordControlsGroup = ({
    audioSrc,
    onRecordComplete,
    currentLetter, // تغيير الاسم من currentLetterId إلى currentLetter
    currentWordName,
    onRecordingUploaded
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [userRecording, setUserRecording] = useState(null);

    const token = useSelector(state => state.user.token);
    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Audio event handlers
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const setAudioData = () => {
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        };

        const handleAudioEnd = () => {
            setIsPlaying(false);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('ended', handleAudioEnd);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('ended', handleAudioEnd);
        };
    }, []);

    // Audio control functions
    const handlePlayPause = () => {
        if (audioSrc && audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => {
                    console.error('Error playing audio:', error);
                    setIsPlaying(false);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e, newValue) => {
        if (audioRef.current?.duration) {
            const seekTime = (newValue / 100) * audioRef.current.duration;
            audioRef.current.currentTime = seekTime;
            setProgress(newValue);
        }
    };

    const handleReplay = () => {
        if (audioRef.current?.duration) {
            audioRef.current.currentTime = 0;
            setProgress(0);
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleBookmark = () => {
        console.log(`Bookmarked at ${audioRef.current?.currentTime || 0} seconds`);
    };

    // Recording functions
    const startRecording = async () => {
        try {
            setIsRecording(true);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setUserRecording(audioBlob);
                handleRecordingComplete(audioBlob);
            };

            mediaRecorderRef.current.start();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Recording completion handler
    const handleRecordingComplete = (audioBlob) => {
        try {
            if (!(audioBlob instanceof Blob)) {
                throw new Error('Invalid audio blob');
            }

            const audioUrl = URL.createObjectURL(audioBlob);
            setUserRecording(audioBlob);

            if (onRecordComplete) {
                onRecordComplete({
                    audioUrl,
                    handleNext: async () => {
                        return await uploadRecording(audioBlob);
                    }
                });
            }
        } catch (error) {
            console.error('Error in recording complete:', error);
        }
    };

    // Upload recording to API
 const uploadRecording = async (audioBlob) => {
        // تحقق من البيانات المطلوبة
        console.log("Uploading with data:", {
            audioBlob,
            currentLetter,
            currentWordName
        });

        if (!audioBlob) {
            console.error("Audio blob is missing!");
            return false;
        }

        if (!currentLetter) {
            console.error("currentLetter is missing! Value:", currentLetter);
            return false;
        }

        if (!currentWordName) {
            console.error("currentWordName is missing! Value:", currentWordName);
            return false;
        }

        try {
            const formData = new FormData();
            formData.append('Letter', currentLetter); // تغيير من LetterId إلى Letter
            formData.append('WordName', currentWordName);
            formData.append('AudioFile', audioBlob, 'recording.wav');

            // Log request details
            console.log('Sending request to API with:', {
                Letter: currentLetter,
                WordName: currentWordName,
                AudioFile: { size: audioBlob.size, type: audioBlob.type }
            });

            const response = await axios.post(
                'https://speech-correction-api.azurewebsites.net/api/Test/evaluate',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Log response details
            console.log('Received response from API:', {
                status: response.status,
                data: response.data,
                headers: response.headers
            });

            if (onRecordingUploaded) {
                onRecordingUploaded(response.data);
            }

            return true;
        } catch (error) {
            console.error('Error uploading recording:', {
                error: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                } : error.message
            });
            return false;
        }
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={audioSrc}
                preload="none"
                onError={(e) => console.error('Audio error:', e)}
                onEnded={() => setIsPlaying(false)}
            />

            <ControlsContainer>
                <SeekBar
                    value={progress}
                    onChange={handleSeek}
                    aria-label="audio progress"
                    disabled={!audioSrc}
                />

                <Box display="flex" justifyContent="center" gap="40px">
                    <IconButton
                        onClick={handleReplay}
                        aria-label="replay"
                        disabled={!audioSrc}
                    >
                        <ReplayIcon sx={{
                            color: !audioSrc ? '#ccc' : '#FCA43C',
                            fontSize: '28px'
                        }} />
                    </IconButton>

                    <IconButton
                        onClick={handlePlayPause}
                        aria-label={isPlaying ? 'pause' : 'play'}
                        disabled={!audioSrc}
                    >
                        {isPlaying ? (
                            <PauseIcon sx={{
                                color: !audioSrc ? '#ccc' : '#FCA43C',
                                fontSize: '28px'
                            }} />
                        ) : (
                            <PlayArrowIcon sx={{
                                color: !audioSrc ? '#ccc' : '#FCA43C',
                                fontSize: '28px'
                            }} />
                        )}
                    </IconButton>

                    <IconButton
                        onClick={handleBookmark}
                        aria-label="bookmark"
                        disabled={!audioSrc}
                    >
                        <BookmarkIcon sx={{
                            color: !audioSrc ? '#ccc' : '#FCA43C',
                            fontSize: '28px'
                        }} />
                    </IconButton>
                </Box>
            </ControlsContainer>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px'
            }}>
                <MicCircle
                    isRecording={isRecording}
                    onClick={handleMicClick}
                >
                    {isRecording ? (
                        <StopIcon sx={{ color: 'red', fontSize: '45px' }} />
                    ) : (
                        <MicIcon sx={{ color: '#FCA43C', fontSize: '45px' }} />
                    )}
                </MicCircle>
            </Box>
        </>
    );
};

export default RecordControlsGroup;