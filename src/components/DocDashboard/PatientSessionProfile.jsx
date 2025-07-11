import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Avatar,
    Divider,
    Chip,
    Button,
    Tabs,
    Tab,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Collapse,
    Stack
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Event as EventIcon,
    AccessTime as AccessTimeIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Cake as CakeIcon,
    LocationCity as LocationCityIcon,
    Public as PublicIcon,
    Wc as WcIcon,
    FamilyRestroom as FamilyRestroomIcon,
    School as SchoolIcon,
    Hearing as HearingIcon,
    Group as GroupIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    VolumeUp as VolumeUpIcon,
    Chat as ChatIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const PatientProfilePage = () => {
    const location = useLocation();
    const { patientId, sessionId } = useParams();
    const [patientData, setPatientData] = useState(location.state?.patientBasicInfo || null);
    const [sessionData, setSessionData] = useState(location.state?.sessionData || null);
    const [reportsData, setReportsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [markingComplete, setMarkingComplete] = useState(false);
    const { token } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const translateGender = (gender) => {
        if (!gender) return 'غير محدد';
        return gender === 'male' ? 'ذكر' : 'أنثى';
    };

    const formatArabicDate = (dateString) => {
        if (!dateString) return 'غير محدد';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ar-EG', options);
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'غير محدد';
        return timeString.split(':').slice(0, 2).join(':');
    };

    const playAudio = (audioUrl) => {
        const audio = new Audio(audioUrl);
        audio.play();
    };

    const fetchPatientReports = async () => {
        try {
            const response = await axios.get('https://speech-correction-api.azurewebsites.net/api/Doctor/patient-report', {
                params: { patientId },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setReportsData(response.data);
        } catch (error) {
            console.error('Error fetching patient reports:', error);
            setReportsData(null);
        }
    };

const markSessionAsCompleted = async () => {
    try {
        setMarkingComplete(true);
        await axios.post(
            `https://speech-correction-api.azurewebsites.net/api/Doctor/mark-session-completed`,
            {}, // body فارغ
            {
                params: { // إضافة query parameters هنا
                    sessionId: sessionId
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        toast.success('تم تحديد الجلسة كمكتملة بنجاح', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            rtl: true,
            theme: "light",
        });
    } catch (error) {
        console.error('Error marking session as completed:', error);
        toast.error('حدث خطأ أثناء تحديد الجلسة كمكتملة', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            rtl: true,
            theme: "light",
        });
    } finally {
        setMarkingComplete(false);
    }
};
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const api = axios.create({
                    baseURL: 'https://speech-correction-api.azurewebsites.net/api',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const fetchPatientData = async () => {
                    try {
                        const response = await api.get('/Patient/get-patient-profile-by-Id', {
                            params: { patientId }
                        });

                        if (response.data && typeof response.data === 'object') {
                            const expectedFields = [
                                'id', 'firstName', 'lastName', 'birthDate',
                                'phoneNumber', 'nationality', 'city', 'gender',
                                'profilePictureUrl', 'familyMembersCount',
                                'siblingRank', 'latestIqTestResult',
                                'latestRightEarTestResult', 'latestLeftEarTestResult'
                            ];

                            const patientData = {};

                            expectedFields.forEach(field => {
                                patientData[field] = response.data[field] !== undefined ?
                                    response.data[field] :
                                    getDefaultValue(field);
                            });

                            return patientData;
                        }
                        throw new Error('Invalid patient data structure');
                    } catch (error) {
                        console.error('Error fetching patient data:', error);
                        return null;
                    }
                };

                const getDefaultValue = (field) => {
                    const defaults = {
                        familyMembersCount: 1,
                        siblingRank: 1,
                        latestIqTestResult: 0,
                        latestRightEarTestResult: 0,
                        latestLeftEarTestResult: 0,
                        profilePictureUrl: null
                    };
                    return defaults[field] !== undefined ? defaults[field] : null;
                };

                const [apiPatientData] = await Promise.all([
                    fetchPatientData(),
                ]);

                setPatientData(prev => ({
                    ...(location.state?.patientBasicInfo || {}),
                    ...(apiPatientData || {}),
                    ...prev
                }));

                await fetchPatientReports();

            } catch (err) {
                const errorMsg = err.response?.data?.message ||
                    err.message ||
                    'حدث خطأ أثناء جلب البيانات';
                console.error('Main Error:', {
                    message: errorMsg,
                    config: err.config,
                    response: err.response?.data
                });
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        if (token && patientId) {
            fetchData();
        }
    }, [token, patientId, sessionId, location.state]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const WordRow = ({ word }) => {
        const [expanded, setExpanded] = useState(false);

        return (
            <>
                <TableRow>
                    <TableCell>
                        <IconButton 
                            size="small" 
                            onClick={() => setExpanded(!expanded)}
                            sx={{ color: '#20B2AA' }}
                        >
                            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                        {word.word}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                        {word.records.length > 0 ? 
                            `${(word.records[0].confidence * 100).toFixed(2)}%` : 
                            'لا توجد بيانات'}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <Box sx={{ 
                                backgroundColor: '#fafafa',
                                p: 2,
                                borderRadius: '8px',
                                mt: 1,
                                mb: 1
                            }}>
                                <Typography variant="subtitle2" sx={{ 
                                    fontFamily: "'Tajawal', sans-serif",
                                    fontWeight: 'bold',
                                    mb: 1,
                                    color: '#20B2AA'
                                }}>
                                    التسجيلات
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ 
                                                fontFamily: "'Tajawal', sans-serif",
                                                fontWeight: 'bold'
                                            }}>التاريخ</TableCell>
                                            <TableCell sx={{ 
                                                fontFamily: "'Tajawal', sans-serif",
                                                fontWeight: 'bold'
                                            }}>الدقة</TableCell>
                                            <TableCell sx={{ 
                                                fontFamily: "'Tajawal', sans-serif",
                                                fontWeight: 'bold'
                                            }}>تشغيل</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {word.records.map((record, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                                                    {formatArabicDate(record.practiceDate)}
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                                                    {`${(record.confidence * 100).toFixed(2)}%`}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton 
                                                        onClick={() => playAudio(record.audioUrl)}
                                                        sx={{ color: '#20B2AA' }}
                                                    >
                                                        <VolumeUpIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress size={60} sx={{ color: '#20B2AA' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                p: 3,
                textAlign: 'center'
            }}>
                <Typography color="error" sx={{
                    fontFamily: "'Tajawal', sans-serif",
                    mb: 2,
                    fontSize: '1.1rem'
                }}>
                    حدث خطأ أثناء جلب البيانات: {error}
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        fontFamily: "'Tajawal', sans-serif",
                        color: '#20B2AA',
                        borderColor: '#20B2AA',
                        '&:hover': {
                            borderColor: '#1a9c95',
                            backgroundColor: 'rgba(32, 178, 170, 0.08)'
                        },
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackClick}
                >
                    العودة
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{
            p: { xs: 2, md: 3 },
            maxWidth: 1000,
            mx: 'auto',
            pb: 6,
            backgroundColor: '#f8f9fa',
            minHeight: '100vh',
            fontFamily: "'Tajawal', sans-serif"
        }} dir="rtl">
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography variant="h4" sx={{
                    fontFamily: "'Tajawal', sans-serif",
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    color: '#20B2AA'
                }}>
                    ملف المريض وتفاصيل الجلسة
                </Typography>
                <Button
                    variant="outlined"
                    sx={{
                        fontFamily: "'Tajawal', sans-serif",
                        color: '#20B2AA',
                        borderColor: '#20B2AA',
                        '&:hover': {
                            borderColor: '#1a9c95',
                            backgroundColor: 'rgba(32, 178, 170, 0.08)'
                        },
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackClick}
                >
                    العودة
                </Button>
            </Box>

            <Stack spacing={3}>
                {/* Profile Card */}
                <Card sx={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    mb: 3,
                    backgroundColor: 'white'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 3,
                        position: 'relative',
                        backgroundColor: '#20B2AA',
                        color: 'white',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px'
                    }}>
                        <Avatar
                            src={patientData?.profilePictureUrl || patientData?.pictureUrl}
                            sx={{
                                width: 120,
                                height: 120,
                                fontSize: '3rem',
                                bgcolor: '#1a9c95',
                                mb: 2,
                                border: '3px solid white'
                            }}
                        >
                            {patientData?.profilePictureUrl || patientData?.pictureUrl ? null : <PersonIcon fontSize="large" />}
                        </Avatar>
                        <Typography variant="h5" sx={{
                            fontFamily: "'Tajawal', sans-serif",
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            fontSize: '1.5rem'
                        }}>
                            {patientData?.firstName || patientData?.name || 'غير معروف'} {patientData?.lastName || ''}
                        </Typography>
                        {patientData?.gender && (
                            <Chip
                                label={translateGender(patientData.gender)}
                                sx={{
                                    mt: 1,
                                    fontFamily: "'Tajawal', sans-serif",
                                    bgcolor: patientData.gender === 'male' ? '#e3f2fd' : '#fce4ec',
                                    color: patientData.gender === 'male' ? '#1976d2' : '#c2185b',
                                    fontWeight: 'bold'
                                }}
                            />
                        )}
                    </Box>

                    <Divider sx={{ my: 1, bgcolor: '#e0e0e0' }} />

                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                            gap: 2
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: '#f5f5f5',
                                p: 1.5,
                                borderRadius: '8px'
                            }}>
                                <CakeIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                <Typography sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    color: '#333',
                                    fontSize: '0.95rem'
                                }}>
                                    تاريخ الميلاد: {formatArabicDate(patientData?.birthDate) || 'غير محدد'}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: '#f5f5f5',
                                p: 1.5,
                                borderRadius: '8px'
                            }}>
                                <PhoneIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                <Typography sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    color: '#333',
                                    fontSize: '0.95rem'
                                }}>
                                    رقم الهاتف: {patientData?.phoneNumber || 'غير محدد'}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: '#f5f5f5',
                                p: 1.5,
                                borderRadius: '8px'
                            }}>
                                <PublicIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                <Typography sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    color: '#333',
                                    fontSize: '0.95rem'
                                }}>
                                    الجنسية: {patientData?.nationality || 'غير محدد'}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: '#f5f5f5',
                                p: 1.5,
                                borderRadius: '8px'
                            }}>
                                <LocationCityIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                <Typography sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    color: '#333',
                                    fontSize: '0.95rem'
                                }}>
                                    المدينة: {patientData?.city || 'غير محدد'}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: '#f5f5f5',
                                p: 1.5,
                                borderRadius: '8px'
                            }}>
                                <FamilyRestroomIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                <Typography sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    color: '#333',
                                    fontSize: '0.95rem'
                                }}>
                                    عدد أفراد الأسرة: {patientData?.familyMembersCount || 'غير محدد'}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: '#f5f5f5',
                                p: 1.5,
                                borderRadius: '8px'
                            }}>
                                <SchoolIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                <Typography sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    color: '#333',
                                    fontSize: '0.95rem'
                                }}>
                                    الترتيب بين الإخوة: {patientData?.siblingRank || 'غير محدد'}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: '#f5f5f5',
                                p: 1.5,
                                borderRadius: '8px'
                            }}>
                                <SchoolIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                <Typography sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    color: '#333',
                                    fontSize: '0.95rem'
                                }}>
                                    نتيجة اختبار الذكاء: {patientData?.latestIqTestResult || 'غير متوفر'}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: '#f5f5f5',
                                p: 1.5,
                                borderRadius: '8px'
                            }}>
                                <HearingIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                <Typography sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    color: '#333',
                                    fontSize: '0.95rem'
                                }}>
                                    نتيجة اختبار الأذن اليمنى: {patientData?.latestRightEarTestResult || 'غير متوفر'}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: '#f5f5f5',
                                p: 1.5,
                                borderRadius: '8px'
                            }}>
                                <HearingIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                <Typography sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    color: '#333',
                                    fontSize: '0.95rem'
                                }}>
                                    نتيجة اختبار الأذن اليسرى: {patientData?.latestLeftEarTestResult || 'غير متوفر'}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Session Card */}
                {sessionData && (
                    <Card sx={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        mb: 3,
                        backgroundColor: 'white'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            p: 3,
                            pb: 1
                        }}>
                            <Typography variant="h6" sx={{
                                fontFamily: "'Tajawal', sans-serif",
                                fontWeight: 'bold',
                                color: '#20B2AA',
                                fontSize: '1.2rem'
                            }}>
                                تفاصيل الجلسة
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<CheckCircleIcon />}
                                onClick={markSessionAsCompleted}
                                disabled={markingComplete}
                                sx={{
                                    fontFamily: "'Tajawal', sans-serif",
                                    backgroundColor: '#20B2AA',
                                    color: 'white',
                                    gap:2,
                                    '&:hover': {
                                        backgroundColor: '#1a9c95',
                                    },
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    mt: { xs: 2, sm: 0 },
                                    minWidth: 180
                                }}
                            >
                                {markingComplete ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    'تم إنهاء الجلسة'
                                )}
                            </Button>
                        </Box>
                        <Divider sx={{ my: 1, bgcolor: '#e0e0e0' }} />

                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 2
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    backgroundColor: '#f5f5f5',
                                    p: 1.5,
                                    borderRadius: '8px'
                                }}>
                                    <EventIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                    <Typography sx={{
                                        fontFamily: "'Tajawal', sans-serif",
                                        color: '#333',
                                        fontSize: '0.95rem'
                                    }}>
                                        تاريخ الجلسة: {formatArabicDate(sessionData.scheduledDate)}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    backgroundColor: '#f5f5f5',
                                    p: 1.5,
                                    borderRadius: '8px'
                                }}>
                                    <AccessTimeIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                    <Typography sx={{
                                        fontFamily: "'Tajawal', sans-serif",
                                        color: '#333',
                                        fontSize: '0.95rem'
                                    }}>
                                        وقت الجلسة: {formatTime(sessionData.sessionTime)}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    backgroundColor: '#f5f5f5',
                                    p: 1.5,
                                    borderRadius: '8px'
                                }}>
                                    <GroupIcon sx={{ color: '#20B2AA', fontSize: '1.2rem' }} />
                                    <Typography sx={{
                                        fontFamily: "'Tajawal', sans-serif",
                                        color: '#333',
                                        fontSize: '0.95rem'
                                    }}>
                                        الجلسة {sessionData.sessionNumber} من {sessionData.totalSessions}
                                    </Typography>
                                </Box>

                                {sessionData.notes && (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        backgroundColor: '#f5f5f5',
                                        p: 1.5,
                                        borderRadius: '8px',
                                        gridColumn: '1 / -1'
                                    }}>
                                        <Typography sx={{
                                            fontFamily: "'Tajawal', sans-serif",
                                            color: '#333',
                                            fontSize: '0.95rem'
                                        }}>
                                            ملاحظات: {sessionData.notes}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Reports Card */}
                <Card sx={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    mt: 3,
                    backgroundColor: 'white'
                }}>
                    <Box sx={{
                        backgroundColor: '#20B2AA',
                        color: 'white',
                        p: 2,
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <GroupIcon />
                        <Typography variant="h6" sx={{
                            fontFamily: "'Tajawal', sans-serif",
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                        }}>
                            تقارير التقدم والتسجيلات
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1, bgcolor: '#e0e0e0' }} />

                    <CardContent>
                        {reportsData ? (
                            <>
                                <Tabs
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: 'divider',
                                        mb: 2,
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: '#20B2AA'
                                        }
                                    }}
                                >
                                    {reportsData.levels.map((level, index) => (
                                        <Tab 
                                            key={index} 
                                            label={`المستوى ${level.level}`} 
                                            sx={{
                                                fontFamily: "'Tajawal', sans-serif",
                                                fontWeight: 'bold',
                                                minWidth: 120,
                                                color: '#20B2AA',
                                                '&.Mui-selected': {
                                                    color: '#20B2AA',
                                                    fontWeight: 'bold'
                                                }
                                            }}
                                        />
                                    ))}
                                </Tabs>

                                <Box sx={{ width: '100%' }}>
                                    {reportsData.levels.map((level, index) => (
                                        <div
                                            key={index}
                                            role="tabpanel"
                                            hidden={activeTab !== index}
                                            id={`level-tabpanel-${index}`}
                                            aria-labelledby={`level-tab-${index}`}
                                        >
                                            {activeTab === index && (
                                                <Box>
                                                    {level.letters.length > 0 ? (
                                                        level.letters.map((letter, letterIndex) => (
                                                            <Box key={letterIndex} sx={{
                                                                mb: 4,
                                                                backgroundColor: '#f9f9f9',
                                                                p: 2,
                                                                borderRadius: '8px',
                                                                borderLeft: '4px solid #20B2AA'
                                                            }}>
                                                                <Typography variant="subtitle1" sx={{
                                                                    fontFamily: "'Tajawal', sans-serif",
                                                                    fontWeight: 'bold',
                                                                    color: '#20B2AA',
                                                                    mb: 1,
                                                                    fontSize: '1.1rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1
                                                                }}>
                                                                    <SchoolIcon fontSize="small" />
                                                                    الحرف: {letter.letterName}
                                                                </Typography>
                                                                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                                                                    <Table>
                                                                        <TableHead>
                                                                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                                                                <TableCell sx={{ 
                                                                                    fontFamily: "'Tajawal', sans-serif",
                                                                                    fontWeight: 'bold',
                                                                                    color: '#20B2AA'
                                                                                }}></TableCell>
                                                                                <TableCell sx={{ 
                                                                                    fontFamily: "'Tajawal', sans-serif",
                                                                                    fontWeight: 'bold',
                                                                                    color: '#20B2AA'
                                                                                }}>الكلمة</TableCell>
                                                                                <TableCell sx={{ 
                                                                                    fontFamily: "'Tajawal', sans-serif",
                                                                                    fontWeight: 'bold',
                                                                                    color: '#20B2AA'
                                                                                }}>أفضل نتيجة</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {letter.words.map((word, wordIndex) => (
                                                                                <WordRow key={wordIndex} word={word} />
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableContainer>
                                                            </Box>
                                                        ))
                                                    ) : (
                                                        <Typography sx={{
                                                            fontFamily: "'Tajawal', sans-serif",
                                                            textAlign: 'center',
                                                            color: '#777',
                                                            py: 3
                                                        }}>
                                                            لا يوجد بيانات لهذا المستوى بعد
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </div>
                                    ))}
                                </Box>
                            </>
                        ) : (
                            <Typography sx={{
                                fontFamily: "'Tajawal', sans-serif",
                                textAlign: 'center',
                                color: '#777',
                                py: 3
                            }}>
                                لا توجد تقارير متاحة لهذا المريض
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Stack>
            <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
        </Box>
    );
};

export default PatientProfilePage;