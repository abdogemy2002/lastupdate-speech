// src/components/Booking/BookingPage.jsx
import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BookingPage = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const doctor = state?.doctor;

    return (
        <Box sx={{ p: 4 }} dir="rtl">
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2, color: '#20B2AA' }}
            >
                العودة
            </Button>

            <Typography variant="h5" fontWeight="bold" mb={2}>
                حجز جلسة مع د. {doctor?.firstName} {doctor?.lastName}
            </Typography>

            {/* هنا هتضيف نموذج الحجز قريبًا */}
            <Typography variant="body1">
                سيتم إضافة نموذج الحجز هنا لاحقًا...
            </Typography>
        </Box>
    );
};

export default BookingPage;
