import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Card,
    Typography,
    Rating,
    Stack,
    useTheme,
    useMediaQuery,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Pagination
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import doctorImage1 from '../../assets/docF.png';
import doctorImage2 from '../../assets/docM.png';

const DoctorCard = ({ doctor, onClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getDoctorImage = (gender) => {
        return gender === 'female' ? doctorImage1 : doctorImage2;
    };

    const translateDay = (day) => {
        const daysMap = {
            'Sunday': 'الأحد',
            'Monday': 'الإثنين',
            'Tuesday': 'الثلاثاء',
            'Wednesday': 'الأربعاء',
            'Thursday': 'الخميس',
            'Friday': 'الجمعة',
            'Saturday': 'السبت'
        };
        return daysMap[day] || day;
    };

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                borderRadius: '16px',
                border: '2px solid #FFA726',
                backgroundColor: '#20B2AA',
                overflow: 'hidden',
                height: 'auto', // تغيير من 170 إلى auto لاستيعاب المحتوى الإضافي
                minHeight: 170,
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0 4px 12px rgba(255, 167, 38, 0.3)'
                },
            }}
            onClick={onClick}
        >
            {/* صورة الطبيب */}
            <Box
                sx={{
                    width: 220,
                    minWidth: 220,
                    overflow: 'hidden',
                    '& img': {
                        width: '100%',
                        height: '101%',
                        objectFit: 'cover',
                        borderLeft: '2.5px solid #FFA726',
                        borderBottomLeftRadius: '16px',
                        borderTopLeftRadius: '16px',
                    }
                }}
            >
                <img
                    src={doctor.profilePictureUrl || getDoctorImage(doctor.gender)}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    onError={(e) => {
                        e.target.src = getDoctorImage(doctor.gender);
                    }}
                />
            </Box>

            {/* بيانات الطبيب */}
            <Box sx={{
                flex: 1,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                {/* الاسم والتقييم */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap'
                }}>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="#fff"
                        fontFamily="'Kidzhood Arabic', Arial, sans-serif"
                    >
                        د. {doctor.firstName || ''} {doctor.lastName || ''}
                    </Typography>
                    <Box dir="rtl"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flexWrap: 'wrap',
                        }}>
                        {/* حل مشكلة ترتيب النجوم */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 0.5
                        }}>
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
                                    '& .MuiRating-icon': {
                                        fontSize: '1.2rem'
                                    }
                                }}
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="text.secondary"
                            sx={{
                                mx: 0.5,
                                fontFamily: "'Tajawal', sans-serif",
                                color: '#fff'
                            }}
                        >
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
                {/* النبذة */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                        fontSize: '0.82rem',
                        lineHeight: 1.4,
                        height: '2.8em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontFamily: "'Tajawal', sans-serif",
                        color: '#fff'
                    }}
                >
                    {doctor.about || 'لا يوجد وصف متوفر'}
                </Typography>

                {/* المدينة والوقت */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mt: 1,
                    fontFamily: "'Tajawal', sans-serif"
                }}>
                    <Chip
                        icon={<LocationOnIcon sx={{ fontSize: 16 }} />}
                        label={`${doctor.city || 'غير محدد'}, ${doctor.nationality || 'غير محدد'}`}
                        size="small"
                        sx={{
                            backgroundColor: '#D1F2EB',
                            color: '#00695C',
                            fontSize: '0.7rem',
                            height: 24,
                            px: 1,
                            fontFamily: "'Tajawal', sans-serif"
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
                            px: 1,
                            fontFamily: "'Tajawal', sans-serif"
                        }}
                    />
                </Box>

                {/* أيام العمل المتاحة */}
                {doctor.workingDays && doctor.workingDays.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <EventIcon sx={{ fontSize: 16, color: '#fff' }} />
                            <Typography variant="body2" sx={{
                                fontFamily: "'Tajawal', sans-serif",
                                color: '#fff',
                                fontSize: '0.8rem'
                            }}>
                                الأيام المتاحة:
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {doctor.workingDays.map((day, index) => (
                                <Chip
                                    key={index}
                                    label={translateDay(day)}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#B3E5FC',
                                        color: '#01579B',
                                        fontSize: '0.65rem',
                                        height: 22,
                                        px: 0.5,
                                        fontFamily: "'Tajawal', sans-serif"
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Card>
    );
};
const DoctorsList = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // حالات التقسيم الصفحي
    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5; // حجم الصفحة ثابت على 5 نتائج
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);

                const response = await axios.get('https://speech-correction-api.azurewebsites.net/api/Doctor/get-all-doctors', {
                    params: {
                        pageIndex,
                        pageSize
                    }
                });

                console.log('API Response:', response.data);
                console.log('Doctors IDs:', response.data.data.map(doctor => doctor.id));

                setDoctors(response.data.data || []);
                setTotalCount(response.data.count || 0);
                setTotalPages(Math.ceil(response.data.count / pageSize));
            } catch (err) {
                setError(err.message);
                console.error('Error fetching doctors:', err);

                if (err.response) {
                    console.error('Error response data:', err.response.data);
                    console.error('Error status:', err.response.status);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [pageIndex]);

    const handleDoctorClick = (doctor) => {
        console.log('Clicked Doctor ID:', doctor.id);
        navigate(`/doctors/${doctor.id}`, { state: { doctor } });
    };

    const handlePageChange = (event, value) => {
        setPageIndex(value);
    };

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                حدث خطأ في تحميل البيانات: {error}
            </Alert>
        );
    }

    return (
        <Box sx={{
            p: 3,
            maxWidth: 800,
            mx: 'auto',
            pb: 6
        }} dir="rtl">
            <Button
                onClick={() => navigate('/chat')} // أضف هذا السطر
                variant="contained"
                sx={{
                    mb: 4,
                    mx: 'auto',
                    display: 'flex',
                    backgroundColor: '#20B2AA',
                    color: 'white',
                    fontFamily: "'Kidzhood Arabic', Arial, sans-serif",
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '800px',
                    justifyContent: 'flex-start',
                    position: 'relative',
                    '&:hover': {
                        backgroundColor: '#1E9C96',
                        transform: 'translateY(-2px)'
                    }
                }}
            >
                <ChatIcon sx={{
                    position: 'absolute',
                    left: '24px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.8rem',
                }} />

                الرسائل
            </Button>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                backgroundColor: '#E0F7FA',
                p: 2,
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
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
                        sx={{
                            '& .MuiPaginationItem-root': {
                                fontFamily: "'Tajawal', sans-serif",
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                minWidth: '36px',
                                height: '36px'
                            },
                            '& .Mui-selected': {
                                backgroundColor: '#FFA726!important',
                                color: 'white',
                                fontWeight: 'bold'
                            }
                        }}
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
                    doctors.map((doctor) => {
                        return (
                            <DoctorCard
                                key={doctor.id || `${doctor.firstName}-${doctor.lastName}`}
                                doctor={doctor}
                                onClick={() => handleDoctorClick(doctor)}
                            />
                        );
                    })
                ) : !loading && (
                    <Typography variant="h6" textAlign="center" sx={{
                        mt: 4,
                        fontFamily: "'Tajawal', sans-serif",
                        backgroundColor: '#FFF8E1',
                        p: 3,
                        borderRadius: '12px',
                        border: '1px solid #FFD54F'
                    }}>
                        لا يوجد أطباء متاحين حالياً. يرجى المحاولة لاحقاً.
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default function SpecialistsList() {
    return <DoctorsList />;
}