import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Button,
    Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// مفروض تستبدل المفتاح ده بمفتاح السترايب العام الحقيقي
const stripePromise = loadStripe('pk_test_YourStripePublicKeyHere');

const BookingConfirmationPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const {
        clientSecret,
        doctor,
        selectedDate,
        selectedTime,
        selectedPackage,
        paymentIntent
    } = state || {};

    const [stripeReady, setStripeReady] = useState(false);

    useEffect(() => {
        if (clientSecret) {
            setStripeReady(true);
        }
    }, [clientSecret]);

    if (!clientSecret) {
        return (
            <Container sx={{ textAlign: 'center', mt: 5 }}>
                <Alert severity="error">لا توجد بيانات دفع متاحة. الرجاء الرجوع للمحاولة مرة أخرى.</Alert>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
                    العودة للصفحة الرئيسية
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" dir="rtl" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                إتمام الدفع
            </Typography>

            <Box sx={{ my: 3 }}>
                <Typography variant="subtitle1">تفاصيل الجلسة:</Typography>
                <Typography>الباقة: {selectedPackage?.title}</Typography>
                <Typography>السعر: {selectedPackage?.price} ج.م</Typography>
                <Typography>التاريخ: {new Date(selectedDate).toLocaleDateString('ar-EG')}</Typography>
                <Typography>الوقت: {selectedTime}</Typography>
            </Box>

            {stripeReady ? (
                <Elements options={{ clientSecret }} stripe={stripePromise}>
                    <CheckoutForm 
                        doctorId={paymentIntent?.doctorId}
                        paymentIntentId={paymentIntent?.paymentIntentId}
                        navigate={navigate}
                    />
                </Elements>
            ) : (
                <Box textAlign="center" mt={5}>
                    <CircularProgress />
                    <Typography mt={2}>جاري تحميل بوابة الدفع...</Typography>
                </Box>
            )}
        </Container>
    );
};

export default BookingConfirmationPage;
