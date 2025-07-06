import React from 'react';
import { List } from '@mui/material';
import ConversationItem from './ConversationItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useChatContext } from './ChatContext';
import {
    EmptyListBox,
    NoConversationsText,
    StartConversationButton
} from './styles/chatStyles';

const ConversationList = ({
    conversations = [],
    currentUserId,
    selectedConversation,
    setSelectedConversation,
    setIsSidebarOpen,
    setIsNewConversationDialogOpen
}) => {
    const { lastSeen } = useChatContext();

    return (
        <List sx={{ overflowY: 'auto', flex: 1 }}>
            {conversations.length === 0 ? (
                <EmptyListBox>
                    <NoConversationsText>
                        لا توجد محادثات بعد
                    </NoConversationsText>

                    <StartConversationButton
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setIsNewConversationDialogOpen(true)}
                    >
                        ابدأ محادثة
                    </StartConversationButton>
                </EmptyListBox>
            ) : (
                conversations.map(conversation =>
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
                            lastSeen={lastSeen}
                        />
                    )
                )
            )}
        </List>
    );
};

export default ConversationList;
