import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import {
    InputWrapper,
    StyledTextField,
    StyledSendButton
} from './styles/chatStyles';

const MessageInput = ({
    newMessage,
    setNewMessage,
    handleSendMessage
}) => (
    <InputWrapper>
        <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="اكتب رسالتك..."
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
        />
        <StyledSendButton
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
        >
            <SendIcon />
        </StyledSendButton>
    </InputWrapper>
);

export default MessageInput;
