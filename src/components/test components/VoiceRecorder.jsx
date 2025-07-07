import React, { useMemo, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
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
    NextButton,
    LoadingContainer
} from './voiceComponentStyles';

import PromptDisplay from './PromptDisplay';
import RecordControlsGroup from './RecordControlsGroup';
import childImage from '../../assets/vector.png';
import useVoiceComponentLogic from './useVoiceComponentLogic';

const VoiceComponent = () => {
    const token = useSelector(state => state.user.token);
    const selectedLetters = useMemo(() => ['ر', 'س'], []);

    const handleNextRef = useRef(null);

    const {
        filteredData,
        currentIndex,
        userRecording,
        hasRecorded,
        isPlayingRecording,
        isLoading,
        isUploading,
        uploadResponse,
        playUserRecording,
        handleRecordComplete: logicHandleRecordComplete,
        handleRecordingUploaded,
        handleNext: logicHandleNext,
        getProblematicLetters
    } = useVoiceComponentLogic(token, selectedLetters);
    const navigate = useNavigate();

    const limitedData = useMemo(() => {
        const map = new Map();
        filteredData.forEach(item => {
            const letter = item.letterId;
            if (!map.has(letter)) map.set(letter, []);
            if (map.get(letter).length < 3) {
                map.get(letter).push(item);
            }
        });
        return Array.from(map.values()).flat();
    }, [filteredData]);

    const currentItem = limitedData[currentIndex] || {};

    const handleRecordComplete = ({ audioUrl, handleNext }) => {
        logicHandleRecordComplete({ audioUrl, handleNext });
        handleNextRef.current = handleNext;
    };

    const handleNext = async () => {
        if (handleNextRef.current) {
            const success = await handleNextRef.current();
            if (!success) return;
        }

        const isLast = currentIndex === limitedData.length - 1;

        if (isLast) {
            const problems = getProblematicLetters();
            if (problems.length === 0) {
                console.log('✅ الطفل عدى الاختبار بنجاح!');
            } else {
                console.warn('⚠️ الطفل عنده مشكلة في الحروف التالية:');
                problems.forEach(({ letter, average }) => {
                    console.warn(`- الحرف "${letter}" بمتوسط ${average}%`);
                });

                const problematicLetterIds = problems.map(p => parseInt(p.letter));
                navigate("/SelectLetters", { state: { problematicLetterIds } });
            }
        }

        logicHandleNext();
    };
    return (
        <Box sx={{ mt: 4, width: '100%', padding: '0 15px', boxSizing: 'border-box' }}>
            <MainContainer>

                {/* ===== Top Section ===== */}
                <TopSection>
                    <ChildFigure>
                        <img src={childImage} alt="صورة الطفل" />
                    </ChildFigure>

                    <PromptDisplayContainer>
                        {isLoading ? (
                            <LoadingContainer>
                                <CircularProgress size={60} thickness={5} sx={{ color: '#18b9c0' }} />
                                <Typography variant="h6" color="primary" mt={2}>
                                    جاري تحميل بيانات الاختبار...
                                </Typography>
                            </LoadingContainer>
                        ) : limitedData.length === 0 ? (
                            <Typography variant="h4" color="error" align="center">
                                لا توجد كلمات متاحة للحروف المحددة
                            </Typography>
                        ) : (
                            <>
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
                                    {currentIndex + 1} / {limitedData.length}
                                </Box>

                                <PromptDisplay prompt={currentItem.name} />
                                {/* 
                                {uploadResponse && (
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: '20px',
                                        left: 0,
                                        right: 0,
                                        textAlign: 'center',
                                        backgroundColor: uploadResponse.isCorrect ? 'rgba(40, 167, 69, 0.8)' : 'rgba(220, 53, 69, 0.8)',
                                        color: 'white',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        margin: '0 20px',
                                        fontFamily: 'Kidzhood Arabic',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem',
                                        animation: 'fadeIn 0.5s ease-in'
                                    }}>
                                        {uploadResponse.isCorrect
                                            ? 'أحسنت! نطقك صحيح'
                                            : `يمكنك التحسين! الدرجة: ${uploadResponse.score}%`}
                                    </Box>
                                )} */}
                            </>
                        )}
                    </PromptDisplayContainer>
                </TopSection>

                {/* ===== Bottom Controls ===== */}
                <BottomControls>
                    <WaveDivider>
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: 'block' }}>
                            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                                opacity=".25"
                            />
                            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                                opacity=".5"
                            />
                            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                            />
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
                            disabled={!hasRecorded || isLoading || limitedData.length === 0}
                        >
                            {isPlayingRecording ? 'إيقاف' : 'اسمع صوتك'}
                        </SideButton>

                        <SideButton
                            startIcon={<BookmarkIcon sx={{ color: '#FCA43C', fontSize: '20px' }} />}
                            disabled={isLoading || limitedData.length === 0}
                        >
                            كلماتي
                        </SideButton>
                    </SideButtons>

                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {isLoading ? (
                            <CircularProgress size={40} sx={{ color: 'white' }} />
                        ) : limitedData.length === 0 ? (
                            <Typography variant="h6" color="white" textAlign="center">
                                لا توجد كلمات متاحة
                            </Typography>
                        ) : (
                            <RecordControlsGroup
                                audioSrc={currentItem.recordingUrl}
                                onRecordComplete={handleRecordComplete}
                                currentLetter={currentItem.letterId}
                                currentWordName={currentItem.name}
                                onRecordingUploaded={handleRecordingUploaded}
                            />
                        )}
                    </Box>
                </BottomControls>
            </MainContainer>

            {/* ===== Next Button ===== */}
            <Box sx={{ position: 'relative', width: '100%', maxWidth: '50%', margin: '20px auto' }}>
                <NextButton
                    onClick={handleNext}
                    disabled={isLoading || !hasRecorded || limitedData.length === 0 || isUploading}
                >
                    {isUploading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : limitedData.length > 0 && currentIndex < limitedData.length - 1 ? (
                        'الى بعده'
                    ) : limitedData.length > 0 ? (
                        'انهاء الاختبار'
                    ) : (
                        'لا توجد كلمات'
                    )}
                </NextButton>

                {/* {uploadResponse && (
                    <Box sx={{
                        position: 'absolute',
                        top: '-30px',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        backgroundColor: uploadResponse.isCorrect ? '#28a745' : '#dc3545',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        animation: 'fadeIn 0.5s ease-in'
                    }}>
                        {uploadResponse.isCorrect
                            ? '✓ نطق صحيح'
                            : `✗ الدرجة: ${uploadResponse.score}%`}
                    </Box>
                )} */}
            </Box>
        </Box>
    );
};

export default VoiceComponent;
