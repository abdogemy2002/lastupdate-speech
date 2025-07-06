import React from 'react';
import { Box, Typography } from '@mui/material';

const ConnectionStatus = ({ status, userName }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: 20,
            backgroundColor: status === 'connected' ? '#4caf50' :
                status === 'connecting' ? '#ff9800' : '#f44336',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 500,
            marginRight: 16,
        }}>
            <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                marginRight: 6,
                backgroundColor: 'white',
            }} />
            {status === 'connected' ? 'Connected' :
                status === 'connecting' ? 'Connecting...' : 'Disconnected'}
        </Box>
        <Typography variant="body2" color="textSecondary">
            {userName}
        </Typography>
    </Box>
);

export default ConnectionStatus;