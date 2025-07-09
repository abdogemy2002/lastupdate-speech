import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    CircularProgress,
    Typography,
    Box
} from '@mui/material';
import {
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon,
    Bookmark as BookmarkIcon
} from '@mui/icons-material';

import {
    MainContainer,
    TopSection,
    ChildFigure,
    PromptDisplayContainer,
    BottomControls,
    WaveDivider,
    SideButtons,
    SideButton,
    ResultButtonsContainer,
    RetryButton,
    NextStepButton
} from './voiceComponentStyles';

import RecordControlsGroup from './TrainingControlsGroup';
import TrainingResultCard from './TrainingResultCard';
import childImage from '../../assets/vector.png';

const TrainingVoiceRecord = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = useSelector(state => state.user.token);
    const [isPlayingRecording, setIsPlayingRecording] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [result, setResult] = useState(null);
    const userRecordingRef = useRef(null);

    const { currentWord, remainingWords = [], levelData } = location.state || {};
    const allWords = currentWord ? [currentWord, ...remainingWords] : [];
    const currentItem = allWords[currentIndex] || {};

    useEffect(() => {
        if (!currentWord) {
            navigate('/learning-stages');
        }
    }, [currentWord, navigate]);

    const playUserRecording = () => {
        if (!userRecordingRef.current) return;

        const audio = new Audio(userRecordingRef.current);
        setIsPlayingRecording(true);

        audio.play().catch(error => {
            console.error('Error playing user recording:', error);
            setIsPlayingRecording(false);
        });

        audio.onended = () => {
            setIsPlayingRecording(false);
        };
    };

    const handleRecordComplete = async ({ audioUrl, handleNext }) => {
        userRecordingRef.current = audioUrl;
        setHasRecorded(true);
        setIsUploading(true);

        const response = await handleNext();
        setResult(response);
        setIsUploading(false);
    };

    const handleNext = () => {
        setResult(null);
        if (currentIndex < allWords.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setHasRecorded(false);
            userRecordingRef.current = null;
        } else {
            navigate('/learning-stages', { state: { levelCompleted: true } });
        }
    };

    const handleRetry = () => {
        setResult(null);
        setHasRecorded(false);
        userRecordingRef.current = null;
    };

    const handleBack = () => {
        navigate('/levelDisplay', { state: { levelData } });
    };

    return (
        <Box sx={{ mt: 4, width: '100%', padding: '0 15px', boxSizing: 'border-box' }}>
            <MainContainer>

                {result ? (
                    <>
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '60vh'
                        }}>
                            <TrainingResultCard
                                isSuccessful={result.isSuccessful}
                                confidence={result.confidence}
                                levelCompleted={result.levelCompleted}
                                recognizedText={result.recognizedText}
                                currentIndex={currentIndex}
                                total={allWords.length}
                            />
                        </Box>

                        {/* أزرار النتيجة */}
                        <Box sx={{ position: 'relative', width: '100%', maxWidth: '50%', margin: '20px auto' }}>
                            <ResultButtonsContainer>
                                <RetryButton onClick={handleRetry}>عيد تاني</RetryButton>
                                <NextStepButton onClick={handleNext}>الى بعده</NextStepButton>
                            </ResultButtonsContainer>
                        </Box>
                    </>
                ) : (
                    <>
                        {/* ===== Top Section ===== */}
                        <TopSection>
                            <ChildFigure>
                                <img src={childImage} alt="صورة الطفل" />
                            </ChildFigure>

                            <PromptDisplayContainer>
                                <Box sx={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    backgroundColor: '#fca43c',
                                    color: 'white',
                                    padding: '8px 14px',
                                    borderRadius: '10px',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    fontFamily: 'Kidzhood Arabic'
                                }}>
                                    {currentIndex + 1} / {allWords.length}
                                </Box>

                                <Typography variant="h2" sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    fontWeight: 'bold',
                                    color: '#333'
                                }}>
                                    {currentItem.name}
                                </Typography>
                                <Typography variant="h5" sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    color: '#666',
                                    mt: 2
                                }}>
                                    حرف {currentItem.letterSymbol}
                                </Typography>
                            </PromptDisplayContainer>
                        </TopSection>

                        {/* ===== Bottom Controls ===== */}
                        <BottomControls>
                            <WaveDivider>
                                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: 'block' }}>
                                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
                                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
                                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
                                </svg>
                            </WaveDivider>

                            <SideButtons>
                                <SideButton
                                    startIcon={isPlayingRecording ? (
                                        <PauseIcon sx={{ color: hasRecorded ? '#FCA43C' : '#ccc', fontSize: '36px' }} />
                                    ) : (
                                        <PlayArrowIcon sx={{ color: hasRecorded ? '#FCA43C' : '#ccc', fontSize: '36px' }} />
                                    )}
                                    onClick={playUserRecording}
                                    disabled={!hasRecorded || allWords.length === 0}
                                >
                                    {isPlayingRecording ? 'إيقاف' : 'اسمع صوتك'}
                                </SideButton>

                                <SideButton
                                    startIcon={<BookmarkIcon sx={{ color: '#FCA43C', fontSize: '20px' }} />}
                                    disabled={allWords.length === 0}
                                >
                                    كلماتي
                                </SideButton>
                            </SideButtons>

                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {allWords.length === 0 ? (
                                    <Typography variant="h6" color="white" textAlign="center">
                                        لا توجد كلمات متاحة
                                    </Typography>
                                ) : (
                                    <RecordControlsGroup
                                        audioSrc={currentItem.recordingUrl}
                                        onRecordComplete={handleRecordComplete}
                                        currentWordName={currentItem.name}
                                        level={levelData?.level}
                                        trainingRecordId={currentItem.id}
                                        levelData={levelData}
                                        currentItem={currentItem}
                                        onRecordingUploaded={setResult}
                                    />
                                )}
                            </Box>
                        </BottomControls>

                        {/* زر التالي */}
                        {(result || currentIndex === allWords.length - 1) && (
                            <Box sx={{ position: 'relative', width: '100%', maxWidth: '50%', margin: '20px auto' }}>
                                <NextStepButton
                                    onClick={handleNext}
                                    disabled={isUploading || !hasRecorded || allWords.length === 0}
                                >
                                    {isUploading ? (
                                        <CircularProgress size={24} sx={{ color: 'white' }} />
                                    ) : currentIndex < allWords.length - 1 ? (
                                        'الى بعده'
                                    ) : (
                                        'انهاء التدريب'
                                    )}
                                </NextStepButton>
                            </Box>
                        )}

                    </>
                )}
            </MainContainer>
        </Box>
    );
};

export default TrainingVoiceRecord;
