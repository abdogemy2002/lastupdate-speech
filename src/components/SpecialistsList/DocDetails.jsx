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
    Divider,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import axios from 'axios';
import doctorImage1 from '../../assets/docF.png';
import doctorImage2 from '../../assets/docM.png';
import backgroundImage from '../../assets/flower-bg.jpg';

// ============= Styles =============
const styles = {
    root: {
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        py: 6
    },
    backButton: {
        color: '#fca43c',
        backgroundColor: '#FDFBF6',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        fontFamily: "'Tajawal', sans-serif",
        '&:hover': {
            backgroundColor: 'rgba(32, 178, 170, 0.1)'
        }
    },
    mainCard: {
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(32, 178, 170, 0.2)',
        backgroundColor: '#fff',
        mb: 4,
        zIndex: 1,
        border: '3px solid rgb(255, 153, 0)',
        backgroundColor: '#20B2AA',
    },
    doctorImageContainer: {
        minHeight: 300,
        position: 'relative',
        backgroundColor: '#FCA43C',
        borderRadius: '16px',
    },
    doctorImageWrapper: {
        position: 'absolute',
        top: '50%',
        right: '50%',
        transform: 'translate(50%, -50%)',
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        border: '0px solid rgb(255, 153, 0)',
        borderLeft: 'rgb(255, 153, 0) 3px solid',
    },
    doctorName: {
        mb: 2,
        fontFamily: "'Tajawal', sans-serif",
        color: '#fff',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
    },
    rating: {
        direction: 'ltr',
        color: '#FCA43C',
        ml: 1
    },
    aboutText: {
        mb: 3,
        lineHeight: 1.8,
        fontFamily: "'Tajawal', sans-serif",
        color: '#fff'
    },
    iconText: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#fff',
    },
    reviewText: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#555',
        lineHeight: 1.6,
        fontSize: '0.95rem'
    },
    workingDayChip: {
        backgroundColor: '#B3E5FC',
        color: '#666',
        fontFamily: "'Tajawal', sans-serif"
    },
    reviewsCard: {
        p: 3,
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(32, 178, 170, 0.1)',
        backgroundColor: '#20B2AA',
        border: '3px solid rgb(255, 153, 0)',
    },
    reviewsTitle: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.5rem'
    },
    reviewItem: {
        p: 2,
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
    },
    reviewerName: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#333',
        fontWeight: 'bold',
        mb: 1
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(252, 164, 60, 0.2)',
        '&:hover': {
            backgroundColor: 'rgba(252, 164, 60, 0.3)'
        }
    },
    prevButton: {
        right: 0
    },
    nextButton: {
        left: 0
    },
    noReviewsText: {
        fontFamily: "'Tajawal', sans-serif",
        textAlign: 'center',
        p: 3,
        backgroundColor: 'rgba(32, 178, 170, 0.05)',
        borderRadius: '8px'
    },
    sidebarCard: {
        p: 3,
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(32, 178, 170, 0.1)',
        position: 'relative',
        textAlign: 'center',
        backgroundColor: '#20B2AA',
        border: '3px solid rgb(255, 153, 0)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    bookButton: {
        backgroundColor: '#FCA43C',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        py: 2,
        borderRadius: '12px',
        fontFamily: "'Tajawal', sans-serif",
        '&:hover': {
            backgroundColor: '#e5942a',
        }
    },
    priceBox: {
        p: 2,
        backgroundColor: '#FDFBF6',
        borderRadius: '8px'
    },
    priceTitle: {
        mb: 1,
        color: '#20B2AA',
        fontFamily: "'Tajawal', sans-serif"
    },
    priceValue: {
        color: '#fca43c',
        fontFamily: "'Tajawal', sans-serif"
    },
    contactBox: {
        p: 2,
        backgroundColor: '#FDFBF6',
        borderRadius: '8px',
        color: '#555',
    },
    contactTitle: {
        mb: 2,
        color: '#20B2AA',
        fontFamily: "'Tajawal', sans-serif"
    }
};

// ============= Component =============
const DocDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { id: doctorId } = useParams();

    const doctor = state?.doctor;
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [activeReviewIndex, setActiveReviewIndex] = useState(0);

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

    const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    const generateTimeSlots = (from, to) => {
        if (!from || !to) return [];
        
        const [fromHour, fromMinute] = from.split(':').map(Number);
        const [toHour, toMinute] = to.split(':').map(Number);
        
        const slots = [];
        let currentHour = fromHour;
        let currentMinute = fromMinute;
        
        while (currentHour < toHour || (currentHour === toHour && currentMinute < toMinute)) {
            const timeString = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;
            slots.push(timeString);
            
            currentMinute += 45; // Session duration 45 minutes
            if (currentMinute >= 60) {
                currentHour += 1;
                currentMinute -= 60;
            }
        }
        
        return slots;
    };

    const handleNextReview = () => {
        setActiveReviewIndex((prevIndex) =>
            prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevReview = () => {
        setActiveReviewIndex((prevIndex) =>
            prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
        );
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
                <Typography variant="h6" color="error" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                    لا توجد بيانات متاحة لهذا الطبيب.
                </Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    الرجوع للخلف
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={styles.root}>
            <Container maxWidth="lg" dir="rtl">
                <Box sx={{ mb: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={styles.backButton}
                    >
                        العودة
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    {/* Main Section */}
                    <Grid item xs={12} md={8}>
                        <Card sx={styles.mainCard}>
                            <Grid container>
                                {/* Doctor Image */}
                                <Grid item xs={12} sm={5} sx={styles.doctorImageContainer}>
                                    <Box sx={styles.doctorImageWrapper}>
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

                                {/* Doctor Info */}
                                <Grid item xs={12} sm={7} sx={{ p: 4 }}>
                                    <Typography variant="h3" fontWeight="bold" sx={styles.doctorName}>
                                        د. {doctor.firstName} {doctor.lastName}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Rating
                                            value={doctor.rating ? Math.min(doctor.rating, 5) : 0}
                                            precision={0.5}
                                            readOnly
                                            sx={styles.rating}
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={styles.iconText}>
                                            ({doctor.ratingCount || 0} تقييم)
                                        </Typography>
                                    </Box>

                                    <Typography variant="body1" sx={styles.aboutText}>
                                        {doctor.about || 'لا يوجد وصف متوفر'}
                                    </Typography>

                                    <Divider sx={{ my: 3 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocationOnIcon sx={{ color: '#FCA43C', ml: 1 }} />
                                                <Typography sx={styles.iconText}>
                                                    {doctor.city || 'غير محدد'}, {doctor.nationality || 'غير محدد'}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTimeIcon sx={{ color: '#FCA43C', ml: 1 }} />
                                                <Typography sx={styles.iconText}>
                                                    {formatTime(doctor.availableFrom)} - {formatTime(doctor.availableTo)}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            {doctor.workingDays?.length > 0 && (
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <EventIcon sx={{ color: '#FCA43C', ml: 1 }} />
                                                        <Typography sx={styles.iconText}>الأيام المتاحة:</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {doctor.workingDays.map((day, i) => (
                                                            <Chip
                                                                key={i}
                                                                label={translateDay(day)}
                                                                size="small"
                                                                sx={styles.workingDayChip}
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

                        {/* Reviews Section */}
                        <Card sx={styles.reviewsCard}>
                            <Typography variant="h5" sx={styles.reviewsTitle}>
                                آراء المرضى
                            </Typography>

                            {loadingReviews ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress color="primary" />
                                </Box>
                            ) : reviews.length > 0 ? (
                                <Box sx={{ position: 'relative' }}>
                                    <IconButton
                                        onClick={handlePrevReview}
                                        sx={{
                                            ...styles.navButton,
                                            ...styles.prevButton,
                                            backgroundColor: 'rgba(252, 164, 60, 0.2)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(252, 164, 60, 0.3)'
                                            }
                                        }}
                                    >
                                        <KeyboardArrowRight sx={{ color: '#FCA43C' }} />
                                    </IconButton>

                                    <Box sx={{ px: 6, py: 2 }}>
                                        <Box sx={styles.reviewItem}>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                <Avatar
                                                    src={`https://speech-correction-api.azurewebsites.net${reviews[activeReviewIndex]?.patientPictureUrl}`}
                                                    alt={reviews[activeReviewIndex]?.displayName}
                                                    sx={{ width: 56, height: 56, border: '2px solid #FCA43C' }}
                                                />
                                                <Box>
                                                    <Typography sx={styles.reviewerName}>
                                                        {reviews[activeReviewIndex]?.displayName}
                                                    </Typography>
                                                    <Rating
                                                        value={reviews[activeReviewIndex]?.rating}
                                                        readOnly
                                                        size="medium"
                                                        sx={{ color: '#FCA43C', mb: 1 }}
                                                    />
                                                    <Typography sx={styles.reviewText}>
                                                        {reviews[activeReviewIndex]?.review}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <IconButton
                                        onClick={handleNextReview}
                                        sx={{
                                            ...styles.navButton,
                                            ...styles.nextButton,
                                            backgroundColor: 'rgba(252, 164, 60, 0.2)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(252, 164, 60, 0.3)'
                                            }
                                        }}
                                    >
                                        <KeyboardArrowLeft sx={{ color: '#FCA43C' }} />
                                    </IconButton>
                                </Box>
                            ) : (
                                <Typography variant="body2" sx={styles.noReviewsText}>
                                    لا توجد تقييمات لهذا الطبيب حتى الآن.
                                </Typography>
                            )}
                        </Card>
                    </Grid>

                    {/* Sidebar Section */}
                    <Grid item xs={12} md={4}>
                        <Card sx={styles.sidebarCard}>
                            {/* 1. Contact Information */}
                            <Box sx={styles.contactBox}>
                                <Typography variant="h6" fontWeight="bold" sx={styles.contactTitle}>
                                    معلومات الاتصال
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1, fontFamily: "'Tajawal', sans-serif" }}>
                                    <strong>البريد الإلكتروني:</strong> doctor@example.com
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                                    <strong>هاتف العيادة:</strong> 01012345678
                                </Typography>
                            </Box>

                            {/* 2. Session Price */}
                            <Box sx={styles.priceBox}>
                                <Typography variant="h6" fontWeight="bold" sx={styles.priceTitle}>
                                    سعر الجلسة
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" sx={styles.priceValue}>
                                    250 ج.م
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                                    لمدة 45 دقيقة
                                </Typography>
                            </Box>

                            {/* 3. Book Button */}
                            <Button
                                onClick={() => {
                                    const availableTimes = generateTimeSlots(doctor.availableFrom, doctor.availableTo);
                                    navigate(`/booking/${doctor.id}`, { 
                                        state: { 
                                            doctor,
                                            availableTimes 
                                        } 
                                    });
                                }}
                                variant="contained"
                                fullWidth
                                sx={styles.bookButton}
                            >
                                حجز جلسة
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default DocDetails;