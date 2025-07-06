import React from 'react';
import { Typography } from '@mui/material';
import { ConnectionWrapper, StatusBox, StatusDot } from './styles/chatStyles';

const ConnectionStatus = ({ status, userName }) => (
    <ConnectionWrapper>
        <StatusBox status={status}>
            <StatusDot />
            {status === 'connected'
                ? 'Connected'
                : status === 'connecting'
                ? 'Connecting...'
                : 'Disconnected'}
        </StatusBox>
        <Typography variant="body2" color="textSecondary">
            {userName}
        </Typography>
    </ConnectionWrapper>
);

export default ConnectionStatus;
