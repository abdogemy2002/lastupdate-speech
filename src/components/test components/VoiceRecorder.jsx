import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import childImage from '../../assets/vector.png';
import {
    Box,
    Button,
    Checkbox, // تم إضافة استيراد Checkbox هنا
    CircularProgress,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    styled,
    Typography
} from '@mui/material';

import {
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon,
    Bookmark as BookmarkIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';
import RecordControlsGroup from './RecordControlsGroup';
import PromptDisplay from './PromptDisplay';


const MainContainer = styled(Box)(({ theme }) => ({
    width: '50%',
    height: 'auto',
    minHeight: '70vh',
    margin: 'auto',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    fontFamily: 'Tahoma, sans-serif',
    overflow: 'visible',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
        width: '70%'
    },
    [theme.breakpoints.up('lg')]: {
        width: '50%'
    }
}));

const TopSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flex: 1,
    gap: '0px',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px'
    },
}));

const ChildFigure = styled(Box)(({ theme }) => ({
    width: '30%',
    backgroundColor: '#FDFBF6',
    borderRadius: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    '& img': {
        width: '80%',
        height: '80%',
        objectFit: 'contain',
        transition: 'transform 0.3s ease',
    },
    [theme.breakpoints.down('sm')]: {
        width: '80%',
        height: '200px',
        marginBottom: '10px',
        '& img': {
            width: '70%',
            height: '70%',
        }
    },
}));

const PromptDisplayContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    backgroundColor: '#FDFBF6',
    borderRadius: '0px',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
        width: '90%',
        height: '150px',
    },
}));

const LetterBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '20px',
    backgroundColor: '#18b9c0',
    color: 'white',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
}));

const WaveDivider = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: '100%',
    left: 0,
    width: '100%',
    height: '40px',
    lineHeight: 0,
    zIndex: 1,
    '& svg': {
        display: 'block',
        width: '100%',
        height: '100%',
        transform: 'scaleY(-1)',
    },
    '& path': {
        fill: '#18b9c0'
    },
    [theme.breakpoints.down('sm')]: {
        height: '30px'
    }
}));

const BottomControls = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#18b9c0',
    padding: '20px',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
    position: 'relative',
    zIndex: 2,
    flexWrap: 'wrap',
    gap: '15px',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        padding: '15px',
        gap: '20px'
    }
}));

const SideButtons = styled(Stack)(({ theme }) => ({
    gap: '10px',
    zIndex: 3,
    flex: 1,
    marginLeft: '2.5%',
    maxWidth: '25%',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap'
    }
}));

const SideButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'white',
    color: '#666666',
    fontWeight: 'bold',
    fontFamily: 'Kidzhood Arabic',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '16px',
    flex: 1,
    minWidth: '120px',
    '&:hover': {
        backgroundColor: '#f5f5f5'
    },
    '&.Mui-disabled': {
        color: '#ccc',
        '& svg': {
            color: '#ccc !important'
        }
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        padding: '10px 15px',
        flex: 'none'
    }
}));

const NextButton = styled(Button)(({ theme }) => ({
    width: '100%',
    maxWidth: '50%',
    margin: '20px auto',
    display: 'block',
    backgroundColor: '#FCA43C',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: "RTL Mocha Yemen Sadah",
    padding: '12px 0',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#e5942e',
        transform: 'scale(1.03)'
    },
    '&.Mui-disabled': {
        backgroundColor: '#ccc',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
        padding: '10px',
        width: 'calc(100% - 30px)',
        maxWidth: '100%'
    },
}));

const LoadingContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '20px'
});

const FilterContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '80%',
    margin: '0 auto 20px auto',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        width: '90%',
    }
}));

const FilterLabel = styled(Typography)({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
    color: '#18b9c0',
    fontFamily: 'Kidzhood Arabic',
    fontSize: '1.2rem'
});


// =================== Main Component ===================
const VoiceComponent = () => {
    const token = useSelector(state => state.user.token);
    const [testData, setTestData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userRecording, setUserRecording] = useState(null);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [isPlayingRecording, setIsPlayingRecording] = useState(false);
    const userRecordingRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [selectedLetters] = useState(['ر', 'س']);
    const [uploadResponse, setUploadResponse] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // إضافة مرجع لدالة إرسال التسجيل
    const uploadRecordingRef = useRef(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    'https://speech-correction-api.azurewebsites.net/api/Test/init-data',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setTestData(response.data);
                console.log('تم جلب بيانات الاختبار:', response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('حدث خطأ في جلب بيانات الاختبار:', error);
                setIsLoading(false);
            }
        };
        fetchTestData();
    }, [token]);

    useEffect(() => {
        if (testData.length > 0) {
            const filtered = testData.filter(item =>
                selectedLetters.includes(item.letter)
            );
            setFilteredData(filtered);
            setCurrentIndex(0);
        }
    }, [testData, selectedLetters]);

    useEffect(() => {
        if (filteredData.length > 0 && currentIndex < filteredData.length) {
            const currentItem = filteredData[currentIndex];
            console.log('Current item data:', {
                letterId: currentItem.letterId,
                name: currentItem.name,
                recordingUrl: currentItem.recordingUrl
            });
        }
    }, [currentIndex, filteredData]);

    // دالة تشغيل تسجيل المستخدم
    const playUserRecording = () => {
        if (!userRecording) return;

        if (isPlayingRecording) {
            userRecordingRef.current.pause();
            setIsPlayingRecording(false);
        } else {
            if (userRecordingRef.current) {
                userRecordingRef.current.currentTime = 0;
            }
            userRecordingRef.current = new Audio(userRecording);
            userRecordingRef.current.play();
            setIsPlayingRecording(true);

            userRecordingRef.current.onended = () => {
                setIsPlayingRecording(false);
            };
        }
    };

    // معالجة اكتمال التسجيل
    const handleRecordComplete = ({ audioUrl, handleNext }) => {
        setUserRecording(audioUrl);
        setHasRecorded(true);

        // تخزين دالة الإرسال في المرجع
        uploadRecordingRef.current = handleNext;
    };

    // معالجة النتيجة المرتجعة من الإرسال
    const handleRecordingUploaded = (response) => {
        console.log('تم استلام نتيجة التقييم:', response);
        setUploadResponse(response);
        setUploadSuccess(true);
    };

    // معالجة الضغط على زر التالي
    const handleNext = async () => {
        if (!uploadRecordingRef.current) return;

        try {
            setIsUploading(true);
            setUploadSuccess(false);

            // استدعاء دالة الإرسال المخزنة في المرجع
            const success = await uploadRecordingRef.current();

            if (success) {
                console.log('تم إرسال التسجيل بنجاح!');

                // الانتقال للكلمة التالية
                if (currentIndex < filteredData.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                    setUserRecording(null);
                    setHasRecorded(false);
                    setIsPlayingRecording(false);
                } else {
                    alert('تهانينا! لقد أكملت جميع الكلمات بنجاح');
                }
            } else {
                alert('حدث خطأ أثناء حفظ التسجيل');
            }
        } catch (error) {
            console.error('حدث خطأ أثناء معالجة التسجيل:', error);
            alert('حدث خطأ غير متوقع');
        } finally {
            setIsUploading(false);
        }
    };

    const currentItem = filteredData[currentIndex] || {};

    return (
        <Box sx={{
            mt: 4,
            width: '100%',
            padding: '0 15px',
            boxSizing: 'border-box'
        }}>
            <MainContainer>
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
                        ) : filteredData.length === 0 ? (
                            <Typography variant="h4" color="error" align="center">
                                لا توجد كلمات متاحة للحروف المحددة
                            </Typography>
                        ) : (
                            <>
                                {/* الترقيم في الأعلى يمين */}
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
                                    {currentIndex + 1} / {filteredData.length}
                                </Box>

                                <PromptDisplay prompt={currentItem.name} />

                                {/* عرض نتيجة التقييم */}
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
                                )}
                            </>
                        )}
                    </PromptDisplayContainer>

                </TopSection>

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
                            startIcon={
                                isPlayingRecording ? (
                                    <PauseIcon sx={{
                                        color: hasRecorded ? '#FCA43C' : '#ccc',
                                        fontSize: '36px'
                                    }} />
                                ) : (
                                    <PlayArrowIcon sx={{
                                        color: hasRecorded ? '#FCA43C' : '#ccc',
                                        fontSize: '36px'
                                    }} />
                                )
                            }
                            onClick={playUserRecording}
                            disabled={!hasRecorded || isLoading || filteredData.length === 0}
                        >
                            {isPlayingRecording ? 'إيقاف' : 'اسمع صوتك'}
                        </SideButton>
                        <SideButton
                            startIcon={<BookmarkIcon sx={{ color: '#FCA43C', fontSize: '20px' }} />}
                            disabled={isLoading || filteredData.length === 0}
                        >
                            كلماتي
                        </SideButton>
                    </SideButtons>

                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {isLoading ? (
                            <Box sx={{ width: '100%', textAlign: 'center' }}>
                                <CircularProgress size={40} sx={{ color: 'white' }} />
                            </Box>
                        ) : filteredData.length === 0 ? (
                            <Typography variant="h6" color="white" textAlign="center">
                                لا توجد كلمات متاحة
                            </Typography>
                        ) : (
                            <RecordControlsGroup
                                audioSrc={currentItem.recordingUrl}
                                onRecordComplete={handleRecordComplete}
                                currentLetter={currentItem.letter} // تغيير من letterId إلى letter
                                currentWordName={currentItem.name}
                                onRecordingUploaded={handleRecordingUploaded}
                            />
                        )}
                    </Box>
                </BottomControls>
            </MainContainer>

            <Box sx={{ position: 'relative', width: '100%', maxWidth: '50%', margin: '20px auto' }}>
                <NextButton
                    onClick={handleNext}
                    disabled={isLoading || !hasRecorded || filteredData.length === 0 || isUploading}
                >
                    {isUploading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : filteredData.length > 0 && currentIndex < filteredData.length - 1 ? (
                        'الى بعده'
                    ) : filteredData.length > 0 ? (
                        'انهاء الاختبار'
                    ) : (
                        'لا توجد كلمات'
                    )}
                </NextButton>

                {uploadResponse && (
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
                )}
            </Box>
        </Box>
    );
};

export default VoiceComponent;

