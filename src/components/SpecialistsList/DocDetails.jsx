import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    Chip,
    Rating,
    Button,
    Avatar,
    CircularProgress,
    Container,
    Grid,
    Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import axios from 'axios';
import doctorImage1 from '../../assets/docF.png';
import doctorImage2 from '../../assets/docM.png';
import BackgroundWrapper from '../shared/BackgroundWrapper';

const DocDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { id: doctorId } = useParams();

    const doctor = state?.doctor;

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    const getDoctorImage = (gender) => gender === 'female' ? doctorImage1 : doctorImage2;

    const translateDay = (day) => {
        const daysMap = {
            Sunday: 'الأحد',
            Monday: 'الإثنين',
            Tuesday: 'الثلاثاء',
            Wednesday: 'الأربعاء',
            Thursday: 'الخميس',
            Friday: 'الجمعة',
            Saturday: 'السبت'
        };
        return daysMap[day] || day;
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`https://speech-correction-api.azurewebsites.net/api/DoctorReview/doctor-reviews`, {
                    params: { doctorId }
                });
                setReviews(response.data || []);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoadingReviews(false);
            }
        };

        if (doctorId) fetchReviews();
    }, [doctorId]);

    if (!doctor) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6" color="error">
                    لا توجد بيانات متاحة لهذا الطبيب.
                </Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    الرجوع للخلف
                </Button>
            </Box>
        );
    }

    return (
        <BackgroundWrapper>
            <Container maxWidth="lg" sx={{ py: 6, zIndex: 5 }} dir="rtl">
                <Box sx={{ mb: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{
                            color: '#20B2AA',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            fontFamily: "'Tajawal', sans-serif",
                            '&:hover': {
                                backgroundColor: 'rgba(32, 178, 170, 0.1)'
                            }
                        }}
                    >
                        العودة
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    {/* الجزء الرئيسي */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(32, 178, 170, 0.2)',
                            backgroundColor: '#20B2AA',
                            mb: 4,
                            zIndex: 1,

                        }}>
                            <Grid container>
                                {/* صورة الطبيب */}
                                <Grid item xs={12} sm={5} sx={{
                                    minHeight: 300,
                                    position: 'relative',
                                    background: '#20B2AA',

                                }}>
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '50%',
                                        transform: 'translate(50%, -50%)',
                                        width: '80%',
                                        height: '80%',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                                    }}>
                                        <img
                                            src={doctor.profilePictureUrl || getDoctorImage(doctor.gender)}
                                            alt="doctor"
                                            onError={(e) => (e.target.src = getDoctorImage(doctor.gender))}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                {/* معلومات الطبيب */}
                                <Grid item xs={12} sm={7} sx={{ p: 4 }}>
                                    <Typography variant="h3" fontWeight="bold" sx={{
                                        mb: 2,
                                        fontFamily: "'Tajawal', sans-serif",
                                        color: '#20B2AA'
                                    }}>
                                        د. {doctor.firstName} {doctor.lastName}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Rating
                                            value={doctor.rating ? Math.min(doctor.rating, 5) : 0}
                                            precision={0.5}
                                            readOnly
                                            sx={{
                                                direction: 'ltr',
                                                color: '#FFD700',
                                                ml: 1
                                            }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            ({doctor.ratingCount || 0} تقييم)
                                        </Typography>
                                    </Box>

                                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                                        {doctor.about || 'لا يوجد وصف متوفر'}
                                    </Typography>

                                    <Divider sx={{ my: 3 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocationOnIcon sx={{ color: '#20B2AA', ml: 1 }} />
                                                <Typography>
                                                    {doctor.city || 'غير محدد'}, {doctor.nationality || 'غير محدد'}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTimeIcon sx={{ color: '#20B2AA', ml: 1 }} />
                                                <Typography>
                                                    من {doctor.availableFrom || '00:00'} إلى {doctor.availableTo || '00:00'}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            {doctor.workingDays?.length > 0 && (
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <EventIcon sx={{ color: '#20B2AA', ml: 1 }} />
                                                        <Typography>الأيام المتاحة:</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {doctor.workingDays.map((day, i) => (
                                                            <Chip
                                                                key={i}
                                                                label={translateDay(day)}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: 'rgba(32, 178, 170, 0.1)',
                                                                    color: '#20B2AA'
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>

                        {/* قسم التقييمات */}
                        <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0 8px 32px rgba(32, 178, 170, 0.1)' }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, fontFamily: "'Tajawal', sans-serif" }}>
                                آراء المرضى
                            </Typography>

                            {loadingReviews ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress color="primary" />
                                </Box>
                            ) : reviews.length > 0 ? (
                                <Box sx={{ maxHeight: 400, overflowY: 'auto', pl: 2 }}>
                                    {reviews.map((review, idx) => (
                                        <Box key={idx} sx={{ mb: 3, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                <Avatar
                                                    src={`https://speech-correction-api.azurewebsites.net${review.patientPictureUrl}`}
                                                    alt={review.displayName}
                                                    sx={{ width: 56, height: 56 }}
                                                />
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="bold" fontFamily="'Tajawal', sans-serif">
                                                        {review.displayName}
                                                    </Typography>
                                                    <Rating
                                                        value={review.rating}
                                                        readOnly
                                                        size="small"
                                                        sx={{ color: '#FFD700', my: 0.5 }}
                                                    />
                                                    <Typography variant="body2" fontFamily="'Tajawal', sans-serif">
                                                        {review.review}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    textAlign: 'center',
                                    p: 3,
                                    backgroundColor: 'rgba(32, 178, 170, 0.05)',
                                    borderRadius: '8px'
                                }}>
                                    لا توجد تقييمات لهذا الطبيب حتى الآن.
                                </Typography>
                            )}
                        </Card>
                    </Grid>

                    {/* الجزء الجانبي */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            p: 3,
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(32, 178, 170, 0.1)',
                            position: 'sticky',
                            top: 20,
                            textAlign: 'center'
                        }}>
                            <Button
                                onClick={() => navigate(`/booking/${doctor.id}`, { state: { doctor } })}
                                variant="contained"
                                fullWidth
                                sx={{
                                    backgroundColor: '#FFA726',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    py: 2,
                                    borderRadius: '12px',
                                    mb: 3,
                                    '&:hover': {
                                        backgroundColor: '#FB8C00',
                                    }
                                }}
                            >
                                حجز جلسة
                            </Button>

                            <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(32, 178, 170, 0.1)', borderRadius: '8px' }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                    سعر الجلسة
                                </Typography>
                                <Typography variant="h4" color="#20B2AA" fontWeight="bold">
                                    250 ج.م
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    لمدة 45 دقيقة
                                </Typography>
                            </Box>

                            <Box sx={{ p: 2, backgroundColor: 'rgba(32, 178, 170, 0.1)', borderRadius: '8px' }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    معلومات الاتصال
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>البريد الإلكتروني:</strong> doctor@example.com
                                </Typography>
                                <Typography variant="body2">
                                    <strong>هاتف العيادة:</strong> 01012345678
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </BackgroundWrapper>
    );
};

export default DocDetails;