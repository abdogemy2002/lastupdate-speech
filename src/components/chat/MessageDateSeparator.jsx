import React from 'react';
import { Box, Chip } from '@mui/material';

const MessageDateSeparator = ({ date }) => {
    return (
        <Box sx={{ textAlign: 'center', my: 2 }}>
            <Chip
                label={date}
                sx={{
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    px: 2,
                    fontWeight: 'bold'
                }}
            />
        </Box>
    );
};

export default MessageDateSeparator;