// src/components/voice/useVoiceComponentLogic.js
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const useVoiceComponentLogic = (token, selectedLetters) => {
    const [testData, setTestData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [isPlayingRecording, setIsPlayingRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResponse, setUploadResponse] = useState(null);
    const userRecordingRef = useRef(null);

    const letterConfidenceHistory = useRef({});

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(
                    'https://speech-correction-api.azurewebsites.net/api/Test/init-data',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTestData(res.data);
                console.log('✅ تم جلب البيانات بنجاح:', res.data);
                setIsLoading(false);
            } catch (err) {
                console.error('❌ خطأ في جلب البيانات:', err);
                toast.error('حدث خطأ أثناء جلب البيانات');
                setIsLoading(false);
            }
        };

        fetchTestData();
    }, [token]);

    useEffect(() => {
        if (testData.length > 0) {
            const filtered = testData.filter((item) =>
                selectedLetters.includes(item.letter)
            );

            const limited = [];
            const seenLetters = new Map();

            for (const item of filtered) {
                const count = seenLetters.get(item.letter) || 0;
                if (count < 3) {
                    limited.push(item);
                    seenLetters.set(item.letter, count + 1);
                }
            }

            setFilteredData(limited);
            setCurrentIndex(0);
            setUploadResponse(null);
            setHasRecorded(false);
        }
    }, [testData, selectedLetters]);

    const currentItem = filteredData[currentIndex];

    const playUserRecording = () => {
        if (!userRecordingRef.current) return;

        const audio = new Audio(userRecordingRef.current);
        setIsPlayingRecording(true);

        audio.play().catch((error) => {
            console.error('Error playing audio:', error);
            setIsPlayingRecording(false);
        });

        audio.onended = () => {
            setIsPlayingRecording(false);
        };
    };

    const handleRecordComplete = ({ audioUrl }) => {
        userRecordingRef.current = audioUrl;
        setHasRecorded(true);
        setUploadResponse(null);
    };

    const cleanArabicWord = (word) => {
        if (!word) return '';
        return word
            .trim()
            .toLowerCase()
            .replace(/[.,،؟?!\s]/g, '')
            .normalize('NFD').replace(/[^\u0621-\u064A]/g, '');
    };

    const handleRecordingUploaded = (response) => {
        setUploadResponse(response);
        setIsUploading(false);

        const { recordedWord, wordName, confidence, letterId } = response;

        const cleanedRecorded = cleanArabicWord(recordedWord);
        const cleanedExpected = cleanArabicWord(wordName);

        console.log('🔍 المقارنة:', {
            مسجلة: cleanedRecorded,
            متوقعة: cleanedExpected,
            تطابق: cleanedRecorded === cleanedExpected
        });

        if (cleanedRecorded === cleanedExpected) {
            if (letterId) {
                if (!letterConfidenceHistory.current[letterId]) {
                    letterConfidenceHistory.current[letterId] = [];
                }
                letterConfidenceHistory.current[letterId].push(confidence);
                console.log('📊 تم تخزين الثقة:', confidence, 'للحرف', letterId);
            } else {
                console.warn('⚠️ letterId مش موجود في الاستجابة:', response);
            }
        } else {
            console.warn('❌ الكلمات لا تتطابق:', {
                مسجلة: recordedWord,
                متوقعة: wordName,
                confidence: confidence
            });

            toast.error('الكلمة المنطوقة لا تطابق الكلمة المطلوبة، حاول مرة أخرى');
        }
    };

    const handleNext = () => {
        if (currentIndex < filteredData.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setHasRecorded(false);
            setUploadResponse(null);
        } else {
            toast.success('لقد أكملت جميع الكلمات المطلوبة!');
        }
    };

    const getProblematicLetters = (threshold = 80) => {
        const problems = [];

        for (const letterId in letterConfidenceHistory.current) {
            const scores = letterConfidenceHistory.current[letterId];
            if (!scores || scores.length === 0) continue;

            const total = scores.reduce((sum, val) => sum + val, 0);
            const avg = total / scores.length;

            if (avg < threshold) {
                problems.push({ letterId: parseInt(letterId), average: parseFloat(avg.toFixed(2)) });
            }
        }

        return problems;
    };

    return {
        filteredData,
        currentIndex,
        currentItem,
        userRecording: userRecordingRef.current,
        hasRecorded,
        isPlayingRecording,
        isLoading,
        isUploading,
        uploadResponse,
        playUserRecording,
        handleRecordComplete,
        handleRecordingUploaded,
        handleNext,
        letterConfidenceHistory: letterConfidenceHistory.current,
        getProblematicLetters
    };
};

export default useVoiceComponentLogic;
