import React from 'react';
import { Box, Tabs, Tab, styled, Container, useTheme, useMediaQuery } from '@mui/material';
import { Dashboard, Chat, Assessment } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationTabs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    const navigate = useNavigate();

    // تحديد التاب النشطة بناءً على المسار
    const getActiveTab = () => {
        if (location.pathname.includes('specialists')) return 0;
        if (location.pathname.includes('PatientDashboard')) return 1;
        if (location.pathname.includes('Test') || location.pathname.includes('report')) return 2;
        return 1; // افتراضيًا لوحة التحكم
    };

    const handleChange = (event, newValue) => {
        switch (newValue) {
            case 0: 
                navigate('/PatientDashboard/specialists'); // تغيير المسار إلى المسار الفرعي
                break;
            case 1: 
                navigate('/PatientDashboard'); 
                break;
            case 2: 
                navigate('/TestWelcome'); 
                break;
            default: 
                navigate('/PatientDashboard');
        }
    };

    const StyledTab = styled(Tab)(({ theme }) => ({
        fontFamily: "'Tajawal', sans-serif",
        textTransform: 'none',
        fontWeight: 600,
        fontSize: isMobile ? '0.85rem' : '1rem',
        color: '#0c4a6e',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        padding: isMobile ? '8px 12px' : '10px 20px',
        margin: '0 4px',
        transition: 'all 0.3s ease',
        minHeight: 'auto',
        height: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        '&.Mui-selected': {
            color: '#fff',
            backgroundColor: '#20B2AA',
            boxShadow: '0 2px 8px rgba(32, 178, 170, 0.4)',
        },
        '&:hover': {
            backgroundColor: 'rgba(32, 178, 170, 0.15)',
            color: '#20B2AA',
        },
        '& .MuiTab-iconWrapper': {
            marginRight: 0,
            marginBottom: 0,
            display: 'flex',
            fontSize: '1.2rem',
        }
    }));

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)',
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
        }}>
            <Container maxWidth="lg" sx={{ p: 0 }}>
                <Tabs
                    value={getActiveTab()}
                    onChange={handleChange}
                    variant={isMobile ? "scrollable" : "fullWidth"}
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    indicatorColor="none"
                    sx={{
                        '& .MuiTabs-flexContainer': {
                            gap: 1,
                            justifyContent: 'center',
                        },
                    }}
                >
                    <StyledTab
                        icon={<Chat />}
                        label="التواصل مع أخصائي"
                        sx={{
                            '& .MuiTab-iconWrapper': {
                                color: getActiveTab() === 0 ? '#fff' : '#20B2AA'
                            }
                        }}
                    />
                    <StyledTab
                        icon={<Dashboard />}
                        label="لوحة التحكم"
                        sx={{
                            '& .MuiTab-iconWrapper': {
                                color: getActiveTab() === 1 ? '#fff' : '#20B2AA'
                            }
                        }}
                    />
                    <StyledTab
                        icon={<Assessment />}
                        label="تقارير"
                        sx={{
                            '& .MuiTab-iconWrapper': {
                                color: getActiveTab() === 2 ? '#fff' : '#20B2AA'
                            }
                        }}
                    />
                </Tabs>
            </Container>
        </Box>
    );
};

export default NavigationTabs;