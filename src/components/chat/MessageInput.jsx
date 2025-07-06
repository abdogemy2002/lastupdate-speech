import React from 'react';
import {
    Box,
    TextField,
    IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = ({
    newMessage,
    setNewMessage,
    handleSendMessage
}) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            }}
            multiline
            maxRows={4}
            sx={{ mr: 1 }}
        />
        <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{ alignSelf: 'flex-end', mb: 1 }}
        >
            <SendIcon />
        </IconButton>
    </Box>
);

export default MessageInput;