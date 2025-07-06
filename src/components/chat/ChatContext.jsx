// ChatContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [lastSeen, setLastSeen] = useState(() => {
        const saved = localStorage.getItem('chatLastSeen');
        return saved ? new Date(saved) : new Date();
    });

    useEffect(() => {
        const now = new Date();
        localStorage.setItem('chatLastSeen', now.toISOString());
    }, []);

    return (
        <ChatContext.Provider value={{ lastSeen, setLastSeen }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);
