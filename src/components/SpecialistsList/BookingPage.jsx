import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Container,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { styles } from './BookingStyles';

const BookingPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const doctor = state?.doctor;
    const availableTimes = state?.availableTimes || [];
    const token = useSelector(state => state.user.token);

    // حالة التحديدات
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [paymentIntent, setPaymentIntent] = useState(null);

    // توليد التواريخ المتاحة (7 أيام من اليوم)
    const generateAvailableDates = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const availableDates = generateAvailableDates();

    // إذا لم تكن هناك أوقات متاحة، استخدم الأوقات الافتراضية
    const timeSlots = availableTimes.length > 0 ? availableTimes : ['06:00 م', '06:45 م', '07:30 م', '08:15 م', '09:00 م'];

    const packages = [
        {
            id: 1,
            title: 'جلسة واحدة',
            description: 'جلسة تدريب فردية للكشف وتحسين مهاراتك',
            price: 200,
            sessions: 1
        },
        {
            id: 2,
            title: '4 جلسات',
            description: 'برنامج تدريبي مكثف لبدء تحسين النطق المحفوظ',
            price: 700,
            sessions: 4
        },
        {
            id: 3,
            title: '8 جلسات',
            description: 'رحلة تدريب شاملة لمعالجة مشاكل النطق وتقديم مساندة',
            price: 1300,
            sessions: 8
        }
    ];

    // تغيير التاريخ
    const handleDateChange = (direction) => {
        const newDate = new Date(selectedDate);
        if (direction === 'next') {
            newDate.setDate(newDate.getDate() + 1);
        } else {
            newDate.setDate(newDate.getDate() - 1);
        }
        setSelectedDate(newDate);
        setSelectedTime(null);
    };

    // تنسيق التاريخ للعرض
    const formatDate = (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('ar-EG', options);
    };

    // تنسيق التاريخ لإرساله للباك-إند
    const formatDateForBackend = (date) => {
        return date.toISOString();
    };

    // التحقق من اكتمال التحديدات
    const isBookingReady = selectedDate && selectedTime && selectedPackage;

    // إرسال البيانات للباك-إند
    const handleBooking = async () => {
        if (!isBookingReady) return;

        setLoading(true);
        setError(null);

        try {
            const paymentData = {
                sessionCount: selectedPackage.sessions,
                totalPrice: selectedPackage.price,
                sessionDate: formatDateForBackend(selectedDate),
                sessionTime: selectedTime,
                doctorId: doctor?.id || null
            };

            const response = await axios.post(
                'https://speech-correction-api.azurewebsites.net/api/Payment/CreateOrUpdatePaymentIntent',
                paymentData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Payment intent response:', response.data);
            if (response.data && response.data.clientSecret) {
                navigate('/booking-confirmation', {
                    state: {
                        doctor,
                        selectedDate,
                        selectedTime,
                        selectedPackage,
                        clientSecret: response.data.clientSecret, // 👈 مهم جدًا
                        paymentIntent: response.data
                    }
                });

            } else {
                throw new Error('لم يتم إنشاء جلسة الدفع بنجاح');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء محاولة الحجز');
            console.error('Error creating payment intent:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = () => {
        setOpenConfirmation(false);
        navigate('/booking-confirmation', {
            state: {
                doctor,
                selectedDate,
                selectedTime,
                selectedPackage,
                paymentIntent
            }
        });
    };

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };

    return (
        <Box sx={styles.root}>
            <Container maxWidth="lg" dir="rtl">
                {/* زر الرجوع والعنوان في نفس الصف */}
                <Box sx={styles.headerContainer}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={styles.backButton}
                    >
                        العودة
                    </Button>

                    {/* عنوان الصفحة في المنتصف */}
                    <Typography variant="h4" sx={styles.pageTitle}>
                        المواعيد والباقات
                    </Typography>

                    {/* عنصر فارغ لتحقيق التوازن */}
                    <Box sx={{ width: '100px' }} />
                </Box>

                {/* التاريخ */}
                <Box sx={styles.dateNavigation}>
                    <IconButton
                        sx={styles.navIconButton}
                        onClick={() => handleDateChange('prev')}
                        disabled={selectedDate <= new Date()}
                    >
                        <ChevronRightIcon />
                    </IconButton>

                    <Typography variant="h6" sx={styles.dateText}>
                        {formatDate(selectedDate)}
                    </Typography>

                    <IconButton
                        sx={styles.navIconButton}
                        onClick={() => handleDateChange('next')}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>

                {/* أوقات الجلسات */}
                <Box sx={styles.timeSlotsContainer}>
                    <Typography variant="h6" sx={styles.packagesTitle}>
                        اختر وقت الجلسة
                    </Typography>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
                            gap: 2
                        }}
                    >
                        {timeSlots.map((time) => (
                            <Button
                                key={time}
                                variant={time === selectedTime ? 'contained' : 'outlined'}
                                sx={styles.timeSlotButton}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </Button>
                        ))}
                    </Box>
                </Box>

                {/* الباقات */}
                <Box sx={styles.packagesContainer}>
                    <Typography variant="h5" sx={styles.packagesTitle}>
                        اختر باقة الجلسات
                    </Typography>

                    <Grid container spacing={3}>
                        {packages.map((pkg) => (
                            <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                                <Card
                                    sx={{
                                        ...styles.packageCard,
                                        ...(selectedPackage?.id === pkg.id && styles.selectedPackage),
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setSelectedPackage(pkg)}
                                >
                                    <CardContent sx={{
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        p: 3
                                    }}>
                                        <Typography variant="h6" sx={styles.packageTitle}>
                                            {pkg.title}
                                        </Typography>

                                        <Typography variant="body2" sx={styles.packageDescription}>
                                            {pkg.description}
                                        </Typography>

                                        <Box sx={styles.priceBox}>
                                            <Typography sx={styles.priceText}>
                                                {pkg.price} ج.م
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* زر الحجز */}
                <Box textAlign="center">
                    {error && (
                        <Typography sx={styles.errorText}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        sx={{
                            ...styles.bookButton,
                            ...(!isBookingReady && styles.disabledButton)
                        }}
                        onClick={handleBooking}
                        disabled={!isBookingReady || loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : isBookingReady ? (
                            'احجز الآن'
                        ) : (
                            'الرجاء اختيار التاريخ والوقت والباقة'
                        )}
                    </Button>
                </Box>
            </Container>

            {/* مودال تأكيد الدفع */}
            <Dialog
                open={openConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="payment-confirmation-dialog"
                dir="rtl"
            >
                <DialogTitle id="payment-confirmation-dialog" sx={{ textAlign: 'center' }}>
                    تأكيد الدفع
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        هل أنت متأكد من أنك تريد المتابعة إلى صفحة الدفع؟
                    </DialogContentText>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">تفاصيل الحجز:</Typography>
                        <Typography>الباقة: {selectedPackage?.title}</Typography>
                        <Typography>السعر: {selectedPackage?.price} ج.م</Typography>
                        <Typography>التاريخ: {formatDate(selectedDate)}</Typography>
                        <Typography>الوقت: {selectedTime}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleCloseConfirmation}
                        color="primary"
                        variant="outlined"
                        sx={{ mx: 1 }}
                    >
                        إلغاء
                    </Button>
                    <Button
                        onClick={handleConfirmPayment}
                        color="primary"
                        variant="contained"
                        sx={{ mx: 1 }}
                        autoFocus
                    >
                        تأكيد والمتابعة للدفع
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BookingPage;