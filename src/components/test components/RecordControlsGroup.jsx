import React, { useState, useRef, useEffect } from 'react';
import { styled, Box, IconButton, Slider, CircularProgress } from '@mui/material';
import {
    Replay as ReplayIcon,
    PlayArrow as PlayArrowIcon,
    Pause as PauseIcon,
    Bookmark as BookmarkIcon,
    Mic as MicIcon,
    Stop as StopIcon
} from '@mui/icons-material';

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

const MicCircle = styled(Box)(({ theme, isRecording }) => ({
    backgroundColor: 'white',
    width: '120px',
    aspectRatio: '1 / 1',
    marginLeft:'15px',
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

const RecordControlsGroup = ({ audioSrc, onRecordComplete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const setAudioData = () => {
            setDuration(audio.duration);
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

    const handlePlayPause = () => {
        if (recordedAudio) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } else if (audioSrc) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e, newValue) => {
        if (audioRef.current.duration) {
            const seekTime = (newValue / 100) * audioRef.current.duration;
            audioRef.current.currentTime = seekTime;
            setProgress(newValue);
        }
    };

    const handleReplay = () => {
        if (audioRef.current.duration) {
            audioRef.current.currentTime = 0;
            setProgress(0);
            if (!isPlaying && (audioSrc || recordedAudio)) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleBookmark = () => {
        console.log(`Bookmarked at ${audioRef.current?.currentTime || 0} seconds`);
    };

    const startRecording = async () => {
        try {
            setIsProcessing(true);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setRecordedAudio(audioUrl);
                if (onRecordComplete) onRecordComplete(audioBlob);
                setIsProcessing(false);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setIsProcessing(false);
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

    return (
        <>
            <audio 
                ref={audioRef} 
                src={recordedAudio || audioSrc} 
                preload="metadata" 
                onEnded={() => setIsPlaying(false)}
            />

            <ControlsContainer>
                <SeekBar
                    value={progress}
                    onChange={handleSeek}
                    aria-label="audio progress"
                    disabled={!audioSrc && !recordedAudio}
                />

                <Box display="flex" justifyContent="center" gap="40px">
                    <IconButton 
                        onClick={handleReplay} 
                        aria-label="replay"
                        disabled={!audioSrc && !recordedAudio}
                    >
                        <ReplayIcon sx={{ 
                            color: (!audioSrc && !recordedAudio) ? '#ccc' : '#FCA43C', 
                            fontSize: '28px' 
                        }} />
                    </IconButton>

                    <IconButton 
                        onClick={handlePlayPause} 
                        aria-label={isPlaying ? 'pause' : 'play'}
                        disabled={!audioSrc && !recordedAudio}
                    >
                        {isPlaying ? (
                            <PauseIcon sx={{ 
                                color: (!audioSrc && !recordedAudio) ? '#ccc' : '#FCA43C', 
                                fontSize: '28px' 
                            }} />
                        ) : (
                            <PlayArrowIcon sx={{ 
                                color: (!audioSrc && !recordedAudio) ? '#ccc' : '#FCA43C', 
                                fontSize: '28px' 
                            }} />
                        )}
                    </IconButton>

                    <IconButton 
                        onClick={handleBookmark} 
                        aria-label="bookmark"
                        disabled={!audioSrc && !recordedAudio}
                    >
                        <BookmarkIcon sx={{ 
                            color: (!audioSrc && !recordedAudio) ? '#ccc' : '#FCA43C', 
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
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <CircularProgress size={45} color="inherit" />
                    ) : (
                        isRecording ? (
                            <StopIcon sx={{ color: 'red', fontSize: '45px' }} />
                        ) : (
                            <MicIcon sx={{ color: '#FCA43C', fontSize: '45px' }} />
                        )
                    )}
                </MicCircle>
            </Box>
        </>
    );
};

export default RecordControlsGroup;