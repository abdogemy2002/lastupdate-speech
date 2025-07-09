import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import happyFace from '../../assets/face very good 1.svg';
import neutralFace from '../../assets/good 1.svg';
import sadFace from '../../assets/meh.svg';

const getFaceImage = (confidence) => {
    if (confidence >= 0.8) return happyFace;
    if (confidence >= 0.6) return neutralFace;
    return sadFace;
};

const getStars = (confidence) => {
    if (confidence >= 0.8) return 3;
    if (confidence >= 0.6) return 2;
    return 1;
};

const TrainingResultCard = ({
    isSuccessful,
    confidence,
    levelCompleted,
    recognizedText,
    onRetry,
    onNext,
    currentIndex,
    total
}) => {
    const percentage = Math.round(confidence * 100);
    const starsCount = getStars(confidence);
    const faceImage = getFaceImage(confidence);

    return (
        <Box
            sx={{
                backgroundColor: '#FFF8E1',
                borderRadius: '20px',
                padding: '30px 20px',
                textAlign: 'center',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                fontFamily: 'Tajawal, sans-serif',
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto'
            }}
        >
            <Box sx={{ fontSize: '1rem', color: '#333', mb: 1, fontFamily: 'Tajawal, sans-serif' }}>
                {currentIndex + 1} / {total}
            </Box>

            <Typography variant="h5" fontWeight="bold" color="#4CAF50" gutterBottom sx={{ fontFamily: 'Tajawal, sans-serif' }}>
                {confidence >= 0.8 ? 'ممتاز' : confidence >= 0.6 ? 'جيد' : 'بحاجة لتحسين'}
            </Typography>

            <Box
                component="img"
                src={faceImage}
                alt="نتيجة الوجه"
                sx={{ width: '120px', height: '120px', mb: 2 }}
            />

            <Box display="flex" justifyContent="center" gap={1} mb={1}>
                {[...Array(starsCount)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#FFC107' }} />
                ))}
            </Box>

            <Typography variant="body1" color="textSecondary" mb={2} sx={{ fontFamily: 'Tajawal, sans-serif' }}>
                الدقة: {percentage}%
            </Typography>

            {recognizedText && (
                <Typography variant="body2" sx={{ color: '#666', mb: 2, fontFamily: 'Tajawal, sans-serif' }}>
                    ما تم التعرف عليه: <strong>{recognizedText}</strong>
                </Typography>
            )}

            <Typography variant="body1" color="primary" fontWeight="bold" mb={3} sx={{ fontFamily: 'Tajawal, sans-serif' }}>
                {confidence >= 0.8
                    ? 'أحسنت يا بطل! أنت نجم اليوم ⭐'
                    : confidence >= 0.6
                    ? 'عمل جيد! حاول مرة أخرى للوصول للنجومية 🌟'
                    : 'لا تيأس! جرب تاني وهتتحسن 💪'}
            </Typography>

           
        </Box>
    );
};

export default TrainingResultCard;
