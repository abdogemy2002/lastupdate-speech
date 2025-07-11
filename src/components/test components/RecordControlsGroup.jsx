// src/components/voice/RecordControlsGroup.jsx
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

const RecordControlsGroup = ({
    audioSrc,
    onRecordComplete,
    currentLetter,
    currentWordName,
    onRecordingUploaded,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [userRecording, setUserRecording] = useState(null);

    const token = useSelector((state) => state.user.token);
    const audioRef = useRef(null);
    const recorderRef = useRef(null);

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

    const handlePlayPause = () => {
        if (audioSrc && audioRef.current) {
            console.log("🎧 Trying to play:", audioSrc);
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((error) => {
                    console.error('❌ Error playing audio:', error);
                    setIsPlaying(false);
                });
            }
            setIsPlaying(!isPlaying);
        } else {
            console.warn("⚠️ لا يوجد مصدر للصوت أو المرجع غير موجود");
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
            console.error('Error starting recording:', error);
            setIsRecording(false);
        }
    };
    // في دالة stopRecording
    const stopRecording = () => {
        if (!recorderRef.current) return;

        // إظهار تحميل أثناء معالجة التسجيل
        toast.info('جاري معالجة التسجيل...', { autoClose: false });

        recorderRef.current.stopRecording(() => {
            toast.dismiss(); // إغلاق رسالة التحميل

            const blob = recorderRef.current.getBlob();

            // تنظيف الـ stream
            if (recorderRef.current.stream) {
                recorderRef.current.stream.getTracks().forEach(track => {
                    track.stop();
                    track.enabled = false;
                });
            }

            setUserRecording(blob);
            handleRecordingComplete(blob);
            setIsRecording(false);
        });
    };

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleRecordingComplete = (audioBlob) => {
        if (!audioBlob) return;
        const audioUrl = URL.createObjectURL(audioBlob);
        setUserRecording(audioBlob);

        if (onRecordComplete) {
            onRecordComplete({
                audioUrl,
                handleNext: async () => await uploadRecording(audioBlob),
            });
        }
    };

    const levenshteinDistance = (a, b) => {
        const matrix = Array.from({ length: a.length + 1 }, () =>
            Array(b.length + 1).fill(0)
        );

        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,       // حذف
                    matrix[i][j - 1] + 1,       // إضافة
                    matrix[i - 1][j - 1] + cost // استبدال
                );
            }
        }

        return matrix[a.length][b.length];
    };


    const uploadRecording = async (audioBlob) => {
        if (!audioBlob || !currentLetter || !currentWordName) {
            toast.error("بيانات ناقصة في رفع التسجيل");
            return false;
        }

        const formData = new FormData();
        formData.append('LetterId', currentLetter);
        formData.append('WordName', currentWordName);
        formData.append('AudioFile', audioBlob, 'recording.wav');


        try {
            const response = await axios.post(
                'https://speech-correction-api.azurewebsites.net/api/Test/evaluate',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 10000
                }
            );

            // ✅ التحقق من وجود البيانات المطلوبة
            if (!response.data || typeof response.data.confidence === 'undefined') {
                throw new Error('استجابة الخادم غير مكتملة');
            }

            const { recordedWord, confidence } = response.data;
            const finalRecorded = recordedWord || '';

            console.log('📊 بيانات الاستجابة:', {
                مسجلة: finalRecorded,
                متوقعة: currentWordName,
                confidence
            });

            // ✅ مقارنة أكثر دقة للكلمات العربية
            const cleanWord = (word) => {
                if (!word) return '';
                return word
                    .trim()
                    .toLowerCase()
                    .replace(/[.,،؟?!\s]/g, '')
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            };

            const cleanedRecorded = cleanWord(recordedWord);
            const cleanedExpected = cleanWord(currentWordName);

            const distance = levenshteinDistance(cleanedRecorded, cleanedExpected);
            const isCorrect = distance <= 1; // نسمح بحرف واحد اختلاف
            console.log(`📏 الفرق بين الكلمتين: ${distance}`);
            console.log(`✅ الكلمة المسجلة: ${cleanedRecorded}`);
            if (onRecordingUploaded) {
                onRecordingUploaded({
                    recordedWord: finalRecorded,
                    wordName: currentWordName,
                    confidence,
                    letterId: currentLetter
                });
            }

            if (isCorrect) {
                toast.success('✅ تم تسجيل الكلمة بنجاح!');
            } else {
                toast.error('❌ الكلمة المسجلة لا تطابق الكلمة المطلوبة');
                console.warn('الكلمة المتوقعة:', currentWordName, 'المسجلة:', finalRecorded);
            }

            return isCorrect;

        } catch (error) {
            console.error('❌ خطأ في رفع التسجيل:', error);
            toast.error(error.response?.data?.message || 'حدث خطأ في معالجة التسجيل');
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
                    <IconButton onClick={handleReplay} aria-label="replay" disabled={!audioSrc}>
                        <ReplayIcon
                            sx={{
                                color: !audioSrc ? '#ccc' : '#FCA43C',
                                fontSize: '28px',
                            }}
                        />
                    </IconButton>

                    <IconButton
                        onClick={handlePlayPause}
                        aria-label={isPlaying ? 'pause' : 'play'}
                        disabled={!audioSrc}
                    >
                        {isPlaying ? (
                            <PauseIcon sx={{ color: '#FCA43C', fontSize: '28px' }} />
                        ) : (
                            <PlayArrowIcon sx={{ color: '#FCA43C', fontSize: '28px' }} />
                        )}
                    </IconButton>

                    <IconButton
                        onClick={handleBookmark}
                        aria-label="bookmark"
                        disabled={!audioSrc}
                    >
                        <BookmarkIcon sx={{ color: '#FCA43C', fontSize: '28px' }} />
                    </IconButton>
                </Box>
            </ControlsContainer>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                }}
            >
                <MicCircle isRecording={isRecording} onClick={handleMicClick}>
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
