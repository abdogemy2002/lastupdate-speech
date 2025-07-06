import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const ChatLayout = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{
            display: 'flex',
            height: 'calc(100vh - 64px)',
            backgroundColor: '#f0f2f5'
        }}>
            {children}
        </Box>
    );
};

export default ChatLayout;