import React from 'react';
import { Box, Tabs, Tab, styled, useTheme, useMediaQuery } from '@mui/material';
import { Wallet, Chat, EventNote } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationTabs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();

    const getActiveTab = () => {
        if (location.pathname.includes('chat')) return 0; // الرسائل
        if (location.pathname.includes('sessions')) return 1; // جلساتي
        if (location.pathname.includes('DocWallet')) return 2; // محفظتي
        return 1; // Default to جلساتي
    };

    const handleChange = (event, newValue) => {
        switch (newValue) {
            case 0: navigate('/chat'); break;
            case 1: navigate('/dashboard/sessions'); break;
            case 2: navigate('/DoctorDashboard/DocWallet'); break;
            default: navigate('/dashboard/sessions');
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        '&.Mui-selected': {
            color: 'white',
            backgroundColor: '#20B2AA',
        },
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            color: '#666',
        },
        '& .MuiTab-iconWrapper': {
            margin: 0,
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
                {/* الرسائل (التبويب الأيسر) */}
                <StyledTab
                    icon={<Chat />}
                    label="الرسائل"
                    sx={{
                        '& .MuiTab-iconWrapper': {
                            color: '#fff'
                        }
                    }}
                />

                {/* جلساتي (التبويب الأوسط) */}
                <StyledTab
                    icon={<EventNote />}
                    label="جلساتي"
                    sx={{
                        '& .MuiTab-iconWrapper': {
                            color: '#fff'
                        }
                    }}
                />

                {/* محفظتي (التبويب الأيمن) */}
                <StyledTab
                    icon={<Wallet />}
                    label="محفظتي"
                    sx={{
                        '& .MuiTab-iconWrapper': {
                            color: '#fff'
                        }
                    }}
                />
            </Tabs>
        </Box>
    );
};

export default NavigationTabs;