// src/pages/SpecialistsList.jsx
import React from 'react';
import {
    Box,
    Stack,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Pagination,
    Card,
    Chip,
    Rating,
    useMediaQuery,
    useTheme
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from '@mui/icons-material/Event';
import doctorImage1 from '../../assets/docF.png';
import doctorImage2 from '../../assets/docM.png';

import {
    mainBoxStyles,
    chatButtonStyles,
    headerBoxStyles,
    paginationStyles,
    noDoctorsStyles,
    cardStyles,
    imageBoxStyles,
    infoBoxStyles,
    ratingBoxStyles,
    aboutTextStyles,
    chipBoxStyles,
    workingDaysBox,
    dayChip
} from './specialistsStyles';

import useSpecialistsLogic from './specialistsLogic';

const DoctorCard = ({ doctor, onClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getDoctorImage = (gender) => {
        return gender === 'female' ? doctorImage1 : doctorImage2;
    };

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

    return (
        <Card sx={cardStyles} onClick={onClick}>
            <Box sx={imageBoxStyles}>
                <img
                    src={doctor.profilePictureUrl || getDoctorImage(doctor.gender)}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    onError={(e) => (e.target.src = getDoctorImage(doctor.gender))}
                />
            </Box>

            <Box sx={infoBoxStyles}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="#fff"
                        fontFamily="'Kidzhood Arabic', Arial, sans-serif"
                    >
                        د. {doctor.firstName || ''} {doctor.lastName || ''}
                    </Typography>
                    <Box dir="rtl" sx={ratingBoxStyles}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            <Rating
                                value={doctor.rating ? Math.min(doctor.rating, 5) : 0}
                                max={5}
                                precision={0.5}
                                readOnly
                                size="small"
                                sx={{
                                    transform: 'scaleX(-1)',
                                    direction: 'ltr',
                                    color: '#FFD700',
                                    '& .MuiRating-icon': { fontSize: '1.2rem' }
                                }}
                            />
                        </Box>
                        <Typography variant="body2" fontWeight="bold" color="#fff">
                            {doctor.rating ? Math.min(doctor.rating, 5).toFixed(1) : '0.0'}
                        </Typography>
                        <Chip
                            label={`${doctor.ratingCount || 0} تقييم`}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: '#FFF8E1',
                                fontFamily: "'Tajawal', sans-serif"
                            }}
                        />
                    </Box>
                </Box>

                <Typography sx={aboutTextStyles}>
                    {doctor.about || 'لا يوجد وصف متوفر'}
                </Typography>

                <Box sx={chipBoxStyles}>
                    <Chip
                        icon={<LocationOnIcon sx={{ fontSize: 16 }} />}
                        label={`${doctor.city || 'غير محدد'}, ${doctor.nationality || 'غير محدد'}`}
                        size="small"
                        sx={{
                            backgroundColor: '#D1F2EB',
                            color: '#00695C',
                            fontSize: '0.7rem',
                            height: 24,
                            px: 1
                        }}
                    />
                    <Chip
                        icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                        label={`${doctor.availableFrom || '00:00'} - ${doctor.availableTo || '00:00'}`}
                        size="small"
                        sx={{
                            backgroundColor: '#FFECB3',
                            color: '#E65100',
                            fontSize: '0.7rem',
                            height: 24,
                            px: 1
                        }}
                    />
                </Box>

                {doctor.workingDays && doctor.workingDays.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <EventIcon sx={{ fontSize: 16, color: '#fff' }} />
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#fff' }}>
                                الأيام المتاحة:
                            </Typography>
                        </Box>
                        <Box sx={workingDaysBox}>
                            {doctor.workingDays.map((day, i) => (
                                <Chip key={i} label={translateDay(day)} size="small" sx={dayChip} />
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Card>
    );
};

const SpecialistsList = () => {
    const {
        doctors,
        loading,
        error,
        pageIndex,
        totalPages,
        handleDoctorClick,
        handlePageChange,
        navigate
    } = useSpecialistsLogic();

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                حدث خطأ في تحميل البيانات: {error}
            </Alert>
        );
    }

    return (
        <Box sx={mainBoxStyles} dir="rtl">
            <Button onClick={() => navigate('/chat')} variant="contained" sx={chatButtonStyles}>
                <ChatIcon sx={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', fontSize: '1.8rem' }} />
                الرسائل
            </Button>

            <Box sx={headerBoxStyles}>
                <Typography variant="body1" sx={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 'bold', fontSize: '1.2rem' }}>
                    الاخصائيون
                </Typography>

                {totalPages > 1 && (
                    <Pagination
                        dir="ltr"
                        count={totalPages}
                        page={pageIndex}
                        onChange={handlePageChange}
                        size="medium"
                        sx={paginationStyles}
                    />
                )}
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress size={60} thickness={4} sx={{ color: '#20B2AA' }} />
                </Box>
            )}

            <Stack spacing={4}>
                {!loading && doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <DoctorCard
                            key={doctor.id || `${doctor.firstName}-${doctor.lastName}`}
                            doctor={doctor}
                            onClick={() => handleDoctorClick(doctor)}
                        />
                    ))
                ) : !loading && (
                    <Typography variant="h6" textAlign="center" sx={noDoctorsStyles}>
                        لا يوجد أطباء متاحين حالياً. يرجى المحاولة لاحقاً.
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default SpecialistsList;
