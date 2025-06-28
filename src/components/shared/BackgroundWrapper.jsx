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
            }}
        >
            {children}
        </Box>
    );
};

export default BackgroundWrapper;