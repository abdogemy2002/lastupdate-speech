import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    Typography,
    Rating,
    Stack,
    useTheme,
    useMediaQuery,
    Chip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// استيراد الصور
import doctorImage1 from '../../assets/docF.png';
import doctorImage2 from '../../assets/docM.png';

const DoctorCard = ({ doctor, onClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getDoctorImage = (gender) => {
        return gender === 'female' ? doctorImage1 : doctorImage2;
    };

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                borderRadius: '16px',
                border: '2px solid #FFA726',
                backgroundColor: '#E0F7FA',
                overflow: 'hidden',
                height: 170,
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
                    src={doctor.image || getDoctorImage(doctor.gender)}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
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
                    <Typography variant="h6" fontWeight="bold" color="#004D40">
                        د. {doctor.firstName} {doctor.lastName}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1, // زيادة المسافة بين العناصر
                        flexWrap: 'wrap'
                    }}>
                        <Rating
                            value={Math.min(doctor.rating, 5)} // التأكد من عدم تجاوز 5
                            max={5} // تحديد الحد الأقصى للنجوم
                            precision={0.5} // دقة نصف نجمة
                            readOnly
                            size="small"
                            sx={{
                                color: '#FFD700',
                                mr: 0.5,
                                '& .MuiRating-icon': {
                                    fontSize: '1.2rem'
                                }
                            }}
                        />
                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="text.secondary"
                            sx={{ mx: 0.5 }}
                        >
                            {Math.min(doctor.rating, 5).toFixed(1)} {/* التأكد من عدم تجاوز 5 */}
                        </Typography>
                        <Chip
                            label={`${doctor.ratingCount} تقييم`}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: '#FFF8E1',
                                // ml: 0.5 // مسافة إضافية على اليسار للشريحة
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
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {doctor.about}
                </Typography>

                {/* المدينة والوقت */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip
                        icon={<LocationOnIcon sx={{ fontSize: 16 }} />}
                        label={`${doctor.city}, ${doctor.nationality}`}
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
                        label={`${doctor.availableFrom} - ${doctor.availableTo}`}
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
            </Box>
        </Card>
    );
};

const DoctorsList = ({ doctors }) => {
    const navigate = useNavigate();

    const handleDoctorClick = (doctor) => {
        navigate(`/doctors/${doctor.id}`, { state: { doctor } });
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }} dir="rtl">
            <Typography variant="h4" component="h1" sx={{
                mb: 3,
                textAlign: 'center',
                color: '#0D47A1',
                fontWeight: 'bold',
                fontFamily: 'Tajawal, sans-serif'
            }}>
                الأخصائيون المتاحون
            </Typography>
            <Stack spacing={2}>
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onClick={() => handleDoctorClick(doctor)}
                    />
                ))}
            </Stack>
        </Box>
    );
};

// بيانات تجريبية
const mockDoctors = [
    {
        id: 1,
        firstName: 'شيماء',
        lastName: 'خالد',
        specialty: 'أخصائية تخاطب',
        city: 'القاهرة',
        nationality: 'مصرية',
        gender: 'female',
        about: 'خبيرة في تنمية المهارات اللغوية لدى الأطفال ومساعدة الأطفال على تحسين مهارات النطق والكلام بطُرق حديثة.',
        workingDays: ['السبت', 'الاثنين', 'الأربعاء'],
        availableFrom: '06:00م',
        availableTo: '09:00م',
        rating: 4.5,
        ratingCount: 87,
        image: doctorImage1
    },
    {
        id: 2,
        firstName: 'أحمد',
        lastName: 'محمد',
        specialty: 'أخصائي تخاطب',
        city: 'الرياض',
        nationality: 'سعودي',
        gender: 'male',
        about: 'متخصص في علاج اضطرابات النطق عند الكبار والصغار باستخدام تقنيات متقدمة وجلسات فردية.',
        workingDays: ['الأحد', 'الثلاثاء', 'الخميس'],
        availableFrom: '04:00م',
        availableTo: '08:00م',
        rating: 4.7,
        ratingCount: 112,
        image: doctorImage2
    }
];

export default function SpecialistsList() {
    return <DoctorsList doctors={mockDoctors} />;
}
