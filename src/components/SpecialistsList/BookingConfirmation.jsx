import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Button,
    Alert,
    Card,
    CardContent,
    Divider,
    Stack,
    Grid // أضفنا هذا الاستيراد
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styles } from './BookingStyles';

const stripePromise = loadStripe('pk_test_51Rhrs2R9USyatFmQB9JPKe5K4C5zMaSevHM0UZCZyPEsCxbhnRr2FVX4aKk3FMXaTvmVGMekkvsQeBAFr8geSms800BIhcHciP');

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

    const stripeOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#1976d2',
                borderRadius: '8px',
                spacingUnit: '4px'
            }
        },
        fields: {
            billingDetails: {
                address: 'never',
                email: 'never',
                phone: 'never',
                name: 'never'
            }
        },
        paymentMethodOrder: ['card']
    };

    if (!clientSecret) {
        return (
            <Container sx={{ ...styles.errorContainer, textAlign: 'center' }}>
                <Alert severity="error" sx={styles.errorAlert}>
                    لا توجد بيانات دفع متاحة. الرجاء الرجوع للمحاولة مرة أخرى.
                </Alert>
                <Button 
                    variant="contained" 
                    sx={styles.backButton} 
                    onClick={() => navigate('/')}
                >
                    العودة للصفحة الرئيسية
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={styles.root}>
            <Container maxWidth="md" dir="rtl">
                {/* زر الرجوع */}
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={styles.backButton}
                >
                    العودة
                </Button>

                <Typography variant="h4" sx={styles.pageTitle} gutterBottom>
                    إتمام عملية الدفع
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card sx={styles.detailsCard}>
                            <CardContent>
                                <Typography variant="h6" sx={styles.sectionTitle} gutterBottom>
                                    تفاصيل الحجز
                                </Typography>
                                
                                <Stack spacing={2} sx={styles.detailsStack}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={styles.detailLabel}>
                                            الطبيب:
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: "'Tajawal', sans-serif",
                                        }}>
                                            د. {doctor?.firstName} {doctor?.lastName}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle1" sx={styles.detailLabel}>
                                            الباقة:
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: "'Tajawal', sans-serif",
                                        }}>{selectedPackage?.title}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle1" sx={styles.detailLabel}>
                                            السعر:
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: "'Tajawal', sans-serif",
                                        }}>{selectedPackage?.price } ج.م</Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle1" sx={styles.detailLabel}>
                                            التاريخ:
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: "'Tajawal', sans-serif",
                                        }}>
                                            {new Date(selectedDate).toLocaleDateString('ar-EG', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle1" sx={styles.detailLabel}>
                                            الوقت:
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: "'Tajawal', sans-serif",
                                        }}>{selectedTime}</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={styles.paymentCard}>
                            <CardContent>
                                <Typography variant="h6" sx={styles.sectionTitle} gutterBottom>
                                    بيانات الدفع
                                </Typography>

                                {stripeReady ? (
                                    <Elements options={stripeOptions} stripe={stripePromise}>
                                        <CheckoutForm
                                            doctorId={paymentIntent?.doctorId}
                                            paymentIntentId={paymentIntent?.paymentIntentId}
                                            navigate={navigate}
                                        />
                                    </Elements>
                                ) : (
                                    <Box sx={styles.loadingBox}>
                                        <CircularProgress />
                                        <Typography sx={styles.loadingText}>
                                            جاري تحميل بوابة الدفع...
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default BookingConfirmationPage;