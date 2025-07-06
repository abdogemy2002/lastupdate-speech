// components/MessageBubble.jsx
import React from 'react';
import { Typography } from '@mui/material';
import { formatTime } from './utils/dateUtils';
import { Bubble, DateBox } from './styles/chatStyles';

const MessageBubble = ({ 
    isCurrentUser, 
    content, 
    sentAt,
    showDate = false,
    dateString = '',
    isFirstInGroup = false,
    isLastInGroup = false
}) => {
    return (
        <>
            {showDate && (
                <DateBox>
                    <Typography variant="caption">
                        {dateString}
                    </Typography>
                </DateBox>
            )}
            
            <Bubble isCurrentUser={isCurrentUser}>
                <Typography sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                    {content}
                </Typography>
                <Typography sx={{
                    fontSize: '0.7rem',
                    color: ' rgba(255, 255, 255, 0.74) ',
                    marginTop: '4px',
                    textAlign: 'right',
                    fontFamily: "'Tajawal', sans-serif"
                }}>
                    {formatTime(sentAt)}
                </Typography>
            </Bubble>
        </>
    );
};

export default MessageBubble;
export { MessageBubble };
