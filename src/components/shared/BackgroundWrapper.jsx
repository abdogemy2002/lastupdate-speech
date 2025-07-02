import React from 'react';
import { Box } from '@mui/material';
import backgroundImage from '../../assets/flower-bg.jpg';

const BackgroundWrapper = ({ children }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                py: 0,
                position: 'relative',
                    '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.55)',
                    zIndex: 0,
                }
            }}
        >
            {children}
        </Box>
    );
};

export default BackgroundWrapper;