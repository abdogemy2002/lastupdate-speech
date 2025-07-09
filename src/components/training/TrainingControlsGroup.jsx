import { toast } from 'react-toastify';
import React, { useState, useRef, useEffect } from 'react';
import { styled, Box, IconButton, Slider } from '@mui/material';
import {
    Replay as ReplayIcon,
    PlayArrow as PlayArrowIcon,
    Pause as PauseIcon,
    Bookmark as BookmarkIcon,
    Mic as MicIcon,
    Stop as StopIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import RecordRTC from 'recordrtc';

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
    boxShadow: isRecording
        ? '0 0 0 0 rgba(255, 0, 0, 0.7)'
        : '0 0 0 0 rgba(252, 164, 60, 0.7)',
    animation: isRecording ? 'pulseRed 1.5s infinite' : 'pulse 1.5s infinite',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: isRecording
            ? '0 0 0 10px rgba(255, 0, 0, 0)'
            : '0 0 0 10px rgba(252, 164, 60, 0)',
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
        },
    },
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

const TrainingControlsGroup = ({
    audioSrc,
    onRecordComplete,
    currentWordName,
    level,
    trainingRecordId,
    currentItem,
    onRecordingUploaded
}) => {
    const [isPlayingRef, setIsPlayingRef] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const token = useSelector((state) => state.user.token);
    const audioRef = useRef(null);
    const recorderRef = useRef(null);
    const userRecordingRef = useRef(null);

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
            setIsPlayingRef(false);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('ended', handleAudioEnd);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('ended', handleAudioEnd);
        };
    }, [audioSrc]);

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlayingRef) {
            audioRef.current.pause();
        } else {
            audioRef.current.play()
                .catch(error => {
                    console.error('Error playing audio:', error);
                    setIsPlayingRef(false);
                });
        }
        setIsPlayingRef(!isPlayingRef);
    };

    const handleSeek = (e, newValue) => {
        if (audioRef.current?.duration) {
            audioRef.current.currentTime = (newValue / 100) * audioRef.current.duration;
            setProgress(newValue);
        }
    };

    const handleReplay = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setProgress(0);
            if (!isPlayingRef) {
                audioRef.current.play()
                    .catch(error => console.error('Error replaying:', error));
            }
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new RecordRTC(stream, {
                type: 'audio',
                mimeType: 'audio/wav',
                recorderType: RecordRTC.StereoAudioRecorder,
                desiredSampRate: 16000,
                numberOfAudioChannels: 1,
            });

            recorder.startRecording();
            recorderRef.current = recorder;
            setIsRecording(true);
        } catch (error) {
            console.error('Recording error:', error);
            toast.error('لا يمكن الوصول إلى الميكروفون');
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (!recorderRef.current) return;

        toast.info('جاري معالجة التسجيل...', { autoClose: false });

        recorderRef.current.stopRecording(() => {
            toast.dismiss();
            const blob = recorderRef.current.getBlob();

            if (recorderRef.current.stream) {
                recorderRef.current.stream.getTracks().forEach(track => track.stop());
            }

            handleRecordingComplete(blob);
            setIsRecording(false);
        });
    };

    const handleRecordingComplete = (audioBlob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        userRecordingRef.current = audioUrl;

        if (onRecordComplete) {
            onRecordComplete({
                audioUrl,
                handleNext: async () => {
                    return await uploadRecording(audioBlob);
                }
            });
        }
    };

    const uploadRecording = async (audioBlob) => {
        if (!audioBlob || audioBlob.size === 0) {
            toast.error('لا يوجد بيانات صوتية صالحة للرفع');
            return {
                isSuccessful: false,
                confidence: 0,
                levelCompleted: false,
                audioUrl: null,
                recognizedText: null
            };
        }

        if (!level || !trainingRecordId) {
            toast.error('بيانات ناقصة: مستوى التدريب أو معرف التدريب');
            return {
                isSuccessful: false,
                confidence: 0,
                levelCompleted: false,
                audioUrl: null,
                recognizedText: null
            };
        }

        const formData = new FormData();
        formData.append('Level', level);
        formData.append('TrainingRecordId', trainingRecordId);
        formData.append('AudioFile', audioBlob, `recording_${Date.now()}.wav`);

        console.log('FormData being sent:', formData.get('Level'), formData.get('TrainingRecordId'), formData.get('AudioFile'));

        try {
            const response = await axios.post(
                'https://speech-correction-api.azurewebsites.net/api/training/practice',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 15000
                }
            );
            console.log('Response from server:', response.data);
            if (!response.data || typeof response.data.isSuccessful === 'undefined') {
                throw new Error('استجابة غير متوقعة من الخادم');
            }

            if (onRecordingUploaded) {
                onRecordingUploaded({
                    ...response.data,
                    wordName: currentWordName,
                    ...(currentItem && {
                        letterSymbol: currentItem.letterSymbol
                    })
                });
            }

            if (response.data.isSuccessful) {
                toast.success(response.data.levelCompleted ?
                    '🎉 لقد أكملت المستوى بنجاح!' :
                    '✅ تم تقييم أدائك بنجاح');
            } else {
                toast.warning('⚠️ يحتاج أداؤك إلى تحسين');
            }

            return response.data;

        } catch (error) {
            let errorMessage = 'حدث خطأ أثناء معالجة التسجيل';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message.includes('timeout')) {
                errorMessage = 'تجاوز الوقت المحدد للاتصال بالخادم';
            } else if (error.message.includes('Network Error')) {
                errorMessage = 'فشل الاتصال بالخادم';
            }

            toast.error(`❌ ${errorMessage}`);

            return {
                isSuccessful: false,
                confidence: 0,
                levelCompleted: false,
                audioUrl: null,
                recognizedText: null,
                error: errorMessage
            };
        }
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={audioSrc}
                preload="none"
                onError={(e) => console.error('Audio error:', e)}
            />

            <ControlsContainer>
                <SeekBar
                    value={progress}
                    onChange={handleSeek}
                    aria-label="تقدم الصوت"
                    disabled={!audioSrc}
                />

                <Box display="flex" justifyContent="center" gap="40px">
                    <IconButton
                        onClick={handleReplay}
                        aria-label="إعادة التشغيل"
                        disabled={!audioSrc}
                    >
                        <ReplayIcon sx={{ color: !audioSrc ? '#ccc' : '#FCA43C', fontSize: '28px' }} />
                    </IconButton>

                    <IconButton
                        onClick={handlePlayPause}
                        aria-label={isPlayingRef ? 'إيقاف' : 'تشغيل'}
                        disabled={!audioSrc}
                    >
                        {isPlayingRef ? (
                            <PauseIcon sx={{ color: '#FCA43C', fontSize: '28px' }} />
                        ) : (
                            <PlayArrowIcon sx={{ color: '#FCA43C', fontSize: '28px' }} />
                        )}
                    </IconButton>

                    <IconButton
                        onClick={() => console.log('حفظ الكلمة')}
                        aria-label="حفظ الكلمة"
                        disabled={!audioSrc}
                    >
                        <BookmarkIcon sx={{ color: '#FCA43C', fontSize: '28px' }} />
                    </IconButton>
                </Box>
            </ControlsContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <MicCircle isRecording={isRecording} onClick={isRecording ? stopRecording : startRecording}>
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

export default TrainingControlsGroup;