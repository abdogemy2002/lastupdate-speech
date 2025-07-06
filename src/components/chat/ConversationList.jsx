import React from 'react';
import {
    List,
    Box,
    Typography,
    Button,
    Divider
} from '@mui/material';
import ConversationItem from './ConversationItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useChatContext } from './ChatContext';

const ConversationList = ({
    conversations = [],
    currentUserId,
    selectedConversation,
    setSelectedConversation,
    setIsSidebarOpen,
    setIsNewConversationDialogOpen
}) => {
    const { lastSeen } = useChatContext(); // استخراج lastSeen من السياق

    return (
        <List sx={{ overflowY: 'auto', flex: 1 }}>
            {conversations.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="textSecondary">
                        No conversations yet
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setIsNewConversationDialogOpen(true)}
                        sx={{ mt: 2 }}
                    >
                        Start a Conversation
                    </Button>
                </Box>
            ) : (
                conversations.map(conversation => (
                    conversation && (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            currentUserId={currentUserId}
                            isSelected={selectedConversation?.id === conversation.id}
                            onSelect={(conv) => {
                                setSelectedConversation(conv);
                                setIsSidebarOpen(false);
                            }}
                            lastSeen={lastSeen} // تمرير lastSeen كمprop
                        />
                    )
                ))
            )}
        </List>
    );
};

export default ConversationList;