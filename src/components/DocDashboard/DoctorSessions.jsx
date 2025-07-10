import React, { useState, useEffect } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Avatar
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import { useSelector } from 'react-redux';
import axios from 'axios';

const DoctorSessionsPage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [pastSessions, setPastSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token } = useSelector((state) => state.user);


    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoading(true);
                setError(null);

                // إنشاء كائن axios مع الهيدر الأساسي
                const api = axios.create({
                    baseURL: 'https://speech-correction-api.azurewebsites.net/api/Doctor',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // جلب الجلسات القادمة والمنتهية بشكل متوازي
                const [upcomingResponse, pastResponse] = await Promise.all([
                    api.get('/upcoming-sessions-detailed'),
                    api.get('/finished-sessions')
                ]);

                // تحويل البيانات
                setUpcomingSessions(upcomingResponse.data.map(session => ({
                    id: session.id,
                    name: session.displayName || 'مريض',
                    date: formatArabicDate(session.scheduledDate),
                    time: formatTime(session.sessionTime),
                    sessionsCount: session.total || 1,
                    avatar: session.pictureUrl
                        ? <Avatar src={session.pictureUrl} sx={{ width: 56, height: 56 }} />
                        : <Avatar sx={{ bgcolor: '#20B2AA', width: 56, height: 56 }}>م</Avatar>
                })));

                setPastSessions(pastResponse.data.map(session => ({
                    id: session.id,
                    name: 'مريض',
                    date: formatArabicDate(session.scheduledDate),
                    time: formatTime(session.sessionTime),
                    sessionsCount: 1,
                    avatar: <Avatar sx={{ bgcolor: '#FFA726', width: 56, height: 56 }}>م</Avatar>
                })));

            } catch (err) {
                const errorMessage = err.response?.data?.message ||
                    err.message ||
                    'حدث خطأ أثناء جلب البيانات';
                setError(errorMessage);
                console.error('Error fetching sessions:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchSessions();
        }
    }, [token]);

    // دوال مساعدة لتنسيق التاريخ والوقت
    const formatArabicDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ar-EG', options);
    };

    const formatTime = (timeString) => {
        return timeString.split(':').slice(0, 2).join(':');
    };
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const renderSessionCard = (session) => (
        <Card key={session.id} sx={styles.card}>
            <Box sx={styles.avatarBox}>
                {typeof session.avatar === 'string' ?
                    <Avatar src={session.avatar} sx={{ width: 60, height: 60 }} /> :
                    session.avatar}
            </Box>
            <CardContent sx={styles.contentBox}>
                <Typography variant="h6" sx={styles.cardTitle}>
                    {session.name}
                </Typography>

                <Box sx={styles.iconRow}>
                    <EventIcon sx={styles.icon} />
                    <Typography sx={styles.iconText}>{session.date}</Typography>
                </Box>

                <Box sx={styles.iconRow}>
                    <AccessTimeIcon sx={styles.icon} />
                    <Typography sx={styles.iconText}>{session.time}</Typography>
                </Box>

                <Box sx={styles.iconRow}>
                    <GroupIcon sx={styles.icon} />
                    <Typography sx={styles.iconText}>{session.sessionsCount} جلسات</Typography>
                </Box>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={styles.loadingBox}>
                <CircularProgress size={60} sx={{ color: '#20B2AA' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={styles.errorBox}>
                <Typography color="error" sx={styles.errorText}>
                    حدث خطأ أثناء جلب البيانات: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={styles.mainBox}>
            <Typography variant="h5" align="center" sx={styles.title}>
                جلساتي
            </Typography>

            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                centered
                TabIndicatorProps={{ style: styles.tabIndicator }}
                sx={styles.tabsContainer}
            >
                <Tab label="الجلسات القادمة" sx={styles.tab(tabIndex === 0)} />
                <Tab label="الجلسات السابقة" sx={styles.tab(tabIndex === 1)} />
            </Tabs>

            <Box mt={3}>
                {tabIndex === 0 &&
                    (upcomingSessions.length > 0
                        ? upcomingSessions.map(renderSessionCard)
                        : <Typography align="center" sx={styles.noSessionsText}>لا توجد جلسات قادمة</Typography>)}

                {tabIndex === 1 &&
                    (pastSessions.length > 0
                        ? pastSessions.map(renderSessionCard)
                        : <Typography align="center" sx={styles.noSessionsText}>لا توجد جلسات سابقة</Typography>)}
            </Box>
        </Box>
    );
};

export default DoctorSessionsPage;

// ======================= STYLES ===========================
const styles = {
    mainBox: {
        p: { xs: 2, md: 3 },
        maxWidth: 800,
        mx: 'auto',
        pb: 6,
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        mt: 2
    },
    title: {
        mb: 3,
        fontFamily: "'Kidzhood Arabic', Arial, sans-serif",
        color: '#20B2AA',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
    },
    tabsContainer: {
        mb: 2,
        '& .MuiTabs-flexContainer': {
            justifyContent: 'center',
        }
    },
    tab: (isActive) => ({
        fontFamily: "'Tajawal', sans-serif",
        fontWeight: 'bold',
        color: isActive ? '#20B2AA' : '#666',
        fontSize: '1rem',
        textTransform: 'none',
        px: { xs: 1, md: 2 },
        minWidth: 'unset'
    }),
    tabIndicator: {
        backgroundColor: '#20B2AA',
        height: 3
    },
    card: {
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'stretch',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        color: '#333',
        overflow: 'hidden',
        minHeight: 140,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        mb: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(32, 178, 170, 0.2)',
            borderColor: '#20B2AA'
        }
    },
    avatarBox: {
        width: { xs: '100%', sm: 120 },
        height: { xs: 100, sm: 'auto' },
        minWidth: { sm: 120 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#20B2AA',
        fontSize: 40,
        fontFamily: "'Kidzhood Arabic', Arial, sans-serif",
        color: '#fff',
        borderBottom: { xs: '2px solid #e0e0e0', sm: 'none' },
        borderRight: { sm: '2px solid #e0e0e0' },
        padding: 2
    },
    contentBox: {
        flex: 1,
        py: 2,
        px: 3
    },
    cardTitle: {
        fontFamily: "'Tajawal', sans-serif",
        fontWeight: 'bold',
        color: '#20B2AA',
        mb: 1
    },
    iconRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mt: 1
    },
    icon: {
        fontSize: '1.1rem',
        color: '#666'
    },
    iconText: {
        fontFamily: "'Tajawal', sans-serif",
        fontSize: '0.95rem',
        color: '#555'
    },
    noSessionsText: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#666',
        mt: 4,
        fontSize: '1.1rem'
    },
    loadingBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px'
    },
    errorBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
        backgroundColor: '#ffeeee',
        borderRadius: '8px',
        p: 2,
        mx: 2
    },
    errorText: {
        fontFamily: "'Tajawal', sans-serif",
        textAlign: 'center'
    }
};