import React, { useRef, useState, useEffect } from 'react';
import { Typography, Box, IconButton, Slider } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { PlayArrow, Pause } from '@mui/icons-material';
import { formatTime } from './utils/dateUtils';
import { Bubble, DateBox } from './styles/chatStyles';

const MessageBubble = ({
    isCurrentUser,
    content,
    sentAt,
    showDate = false,
    dateString = '',
    isFirstInGroup = false,
    isLastInGroup = false,
    type = 0,
    audioUrl = null
}) => {
    const isAudio = type === 1 || (audioUrl && audioUrl !== '');

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleTimeUpdate = () => setProgress(audio.currentTime);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.error('Error playing audio:', e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleSliderChange = (e, newValue) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = newValue;
            setProgress(newValue);
        }
    };

    return (
        <>
            {showDate && (
                <DateBox>
                    <Typography variant="caption">{dateString}</Typography>
                </DateBox>
            )}

            <Bubble isCurrentUser={isCurrentUser}>
                {isAudio ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        width: '100%',
                        maxWidth: 300
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: isCurrentUser ? '#fff' : '#333'
                        }}>
                            <MicIcon fontSize="small" />
                            <Typography variant="body2" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                                رسالة صوتية
                            </Typography>
                        </Box>

                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            hidden
                            preload="metadata"
                            onError={(e) => console.error('Audio error:', e)}
                        />

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <IconButton
                                onClick={togglePlay}
                                size="small"
                                sx={{
                                    backgroundColor: isCurrentUser ? '#FFA726' : '#20B2AA',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: isCurrentUser ? '#fb8c00' : '#1d9b91'
                                    },
                                    width: 32,
                                    height: 32
                                }}
                            >
                                {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                            </IconButton>

                            <Slider
                                size="small"
                                value={progress}
                                min={0}
                                max={duration}
                                step={0.1}
                                onChange={handleSliderChange}
                                sx={{
                                    flex: 1,
                                    color: isCurrentUser ? '#FFA726' : '#20B2AA',
                                    '& .MuiSlider-thumb': {
                                        width: 12,
                                        height: 12,
                                        display: 'none'
                                    },
                                    '&:hover .MuiSlider-thumb': {
                                        display: 'block'
                                    },
                                    '& .MuiSlider-rail': {
                                        height: 4,
                                        borderRadius: 2
                                    },
                                    '& .MuiSlider-track': {
                                        height: 4,
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                ) : (
                    <Typography sx={{ fontFamily: "'Tajawal', sans-serif" }}>{content}</Typography>
                )}

                <Typography
                    sx={{
                        fontSize: '0.7rem',
                        color: isCurrentUser ? 'rgba(255, 255, 255, 0.74)' : 'rgba(0, 0, 0, 0.54)',
                        marginTop: '4px',
                        textAlign: 'right',
                        fontFamily: "'Tajawal', sans-serif"
                    }}
                >
                    {formatTime(sentAt)}
                </Typography>
            </Bubble>
        </>
    );
};

export default MessageBubble;
export { MessageBubble };