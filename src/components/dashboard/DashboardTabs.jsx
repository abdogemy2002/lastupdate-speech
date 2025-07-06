import React from 'react';
import { Box, Tabs, Tab, styled, useTheme, useMediaQuery } from '@mui/material';
import { Dashboard, Chat, Assessment } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationTabs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();

    const getActiveTab = () => {
        if (location.pathname.includes('specialists')) return 0;
        if (location.pathname.includes('PatientDashboard')) return 1;
        if (location.pathname.includes('lol') || location.pathname.includes('report')) return 2;
        return 1;
    };

    const handleChange = (event, newValue) => {
        switch (newValue) {
            case 0: navigate('/PatientDashboard/specialists'); break;
            case 1: navigate('/PatientDashboard'); break;
            case 2: navigate('/TestWelcomek'); break;
            default: navigate('/PatientDashboard');
        }
    };

    const StyledTab = styled(Tab)(({ theme }) => ({
        fontFamily: '"Kidzhood Arabic", sans-serif',
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: isMobile ? '0.85rem' : '1rem',
        borderRadius: '12px',

        color: '#fff',
        backgroundColor: 'transparent',
        padding: isMobile ? '10px 12px' : '12px 16px',
        minHeight: 'auto',
        height: 'auto',
        flex: 1,
        transition: 'all 0.3s ease',
        flexDirection: 'row', // تغيير اتجاه العناصر إلى أفقي
        alignItems: 'center', // توسيط العناصر عمودياً
        gap: '8px', // مسافة بين الأيقونة والنص
        '&.Mui-selected': {
            color: 'white',
            backgroundColor: '#20B2AA',
        },
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            color: '#666',
        },
        '& .MuiTab-iconWrapper': {
            margin: 0, // إزالة الهوامش الافتراضية
            display: 'flex',
            fontSize: '1.2rem',
        }
    }));

    return (
        <Box sx={{
            width: '100%',
            borderRadius: '12px',
            backgroundColor: '#fca43c',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            mb: 3,
        }}>
            <Tabs
                value={getActiveTab()}
                onChange={handleChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
                allowScrollButtonsMobile
                indicatorColor="none"
                sx={{
                    minHeight: 'auto',
                    borderRadius: '12px',

                    '& .MuiTabs-flexContainer': {
                        width: '100%',
                    },
                }}
            >
                <StyledTab
                    icon={<Chat />}
                    label="التواصل مع أخصائي"
                    sx={{
                        '& .MuiTab-iconWrapper': {
                            // color: getActiveTab() === 0 ? 'white' : '#2b2b2b'
                            color: '#fff'
                        }
                    }}
                />
                <StyledTab
                    icon={<Dashboard />}
                    label="لوحة التحكم"
                    sx={{
                        '& .MuiTab-iconWrapper': {
                            // color: getActiveTab() === 1 ? 'white' : '#2b2b2b'
                            color: '#fff'

                        }
                    }}
                />
                <StyledTab
                    icon={<Assessment />}
                    label="تقارير"
                    sx={{
                        '& .MuiTab-iconWrapper': {
                            // color: getActiveTab() === 2 ? 'white' : '#2b2b2b'
                            color: '#fff'

                        }
                    }}
                />
            </Tabs>
        </Box>
    );
};

export default NavigationTabs;