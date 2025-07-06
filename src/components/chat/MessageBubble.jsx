import React from 'react';
import { Typography, Box } from '@mui/material';
import { formatTime } from './utils/dateUtils';

const MessageBubble = ({ isCurrentUser, content, sentAt }) => (
    <Box sx={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '18px',
        marginBottom: '12px',
        alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
        backgroundColor: isCurrentUser ? '#dcf8c6' : 'white',
        boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
        wordBreak: 'break-word',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderColor: isCurrentUser
                ? 'transparent transparent #dcf8c6 transparent'
                : 'transparent transparent white transparent',
            borderWidth: isCurrentUser
                ? '0 0 12px 12px'
                : '0 12px 12px 0',
            right: isCurrentUser ? '-8px' : 'auto',
            left: isCurrentUser ? 'auto' : '-8px',
            transform: isCurrentUser ? 'rotate(-20deg)' : 'rotate(20deg)'
        }
    }}>
        <Typography>{content}</Typography>
        <Typography sx={{
            fontSize: '0.7rem',
            color: '#888',
            marginTop: 1,
            textAlign: 'right',
        }}>
            {formatTime(sentAt)}
        </Typography>
    </Box>
);

export default MessageBubble;