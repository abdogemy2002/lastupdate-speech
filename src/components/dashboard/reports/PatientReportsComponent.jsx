import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
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
    CircularProgress,
    Alert
} from '@mui/material';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    VolumeUp as VolumeUpIcon,
    School as SchoolIcon
} from '@mui/icons-material';

const WordRow = ({ word, formatArabicDate }) => {
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
                                                    onClick={() => {
                                                        const audio = new Audio(record.audioUrl);
                                                        audio.play();
                                                    }}
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

const PatientReportsComponent = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [reportsData, setReportsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const patientId = useSelector((state) => state.user.patientId || state.user.id);

    const formatArabicDate = (dateString) => {
        if (!dateString) return 'غير محدد';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ar-EG', options);
    };

    useEffect(() => {
        const fetchReportsData = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://speech-correction-api.azurewebsites.net/api/Doctor/patient-report?patientId=${patientId}`
                );
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                setReportsData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchReportsData();
        } else {
            setError('Patient ID is missing');
            setLoading(false);
        }
    }, [patientId]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
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
                <SchoolIcon />
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
                                                                        <WordRow 
                                                                            key={wordIndex} 
                                                                            word={word} 
                                                                            formatArabicDate={formatArabicDate}
                                                                        />
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
                        لا توجد تقارير متاحة
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default PatientReportsComponent;