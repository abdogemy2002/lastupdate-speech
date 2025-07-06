import * as signalR from '@microsoft/signalr';

// متغير لحفظ حالة الاتصال
let connection = null;

// متغير لمعرفة ما إذا كنا في طور إعادة الاتصال
let isReconnecting = false;

// متغير لحفظ token للاستخدام عند إعادة الاتصال
let currentToken = null;
let isStarting = false;

// مصفوفة لحفظ الـ callbacks للأحداث
const eventCallbacks = {
    'InitializeConversations': [],
    'ConversationStarted': [],
    'ReceiveMessage': [],
    'MessageSent': []
};

/**
 * تهيئة الاتصال بـ SignalR Hub
 * @param {string} token - JWT token للمصادقة
 * @returns {Promise<signalR.HubConnection|null>} - اتصال SignalR
 */
export const startConnection = async (token) => {
    if (isStarting) {
        console.warn("Connection is already starting...");
        return;
    }

    isStarting = true;

    try {
        currentToken = token;

        // لو في اتصال شغال بالفعل
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            console.log("Already connected");
            return connection;
        }

        // لو الاتصال في حالة Connecting أو Reconnecting، استنى شوية
        if (connection && (connection.state === signalR.HubConnectionState.Connecting || connection.state === signalR.HubConnectionState.Reconnecting)) {
            console.log("Connection is still in progress...");
            return;
        }

        // لو في اتصال قديم، وقفه
        if (connection) {
            await stopConnection();
        }

        const hubUrl = new URL('https://speech-correction-api.azurewebsites.net/chathub');
        hubUrl.searchParams.append('access_token', token);

        connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl.toString(), {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        setupConnectionEvents();

        await connection.start();
        console.log('SignalR connection established successfully');
        isReconnecting = false;
        return connection;
    } catch (err) {
        isStarting = false; // أضف هذا السطر
        throw err; // أعد رمي الخطأ للتعامل معه في المكون
        
        console.error('SignalR connection error:', err);

        if (!isReconnecting) {
            isReconnecting = true;
            setTimeout(() => startConnection(token), 5000);
        }

        return null;
    } finally {
        isStarting = false;
    }
};

/**
 * إعداد معالج الأحداث للاتصال
 */
const setupConnectionEvents = () => {
    if (!connection) return;

    // معالج إعادة الاتصال
    connection.onreconnecting((error) => {
        console.warn('SignalR connection lost, attempting to reconnect...', error);
        isReconnecting = true;
    });

    // معالج إعادة الاتصال الناجحة
    connection.onreconnected((connectionId) => {
        console.log('SignalR reconnected successfully with connectionId:', connectionId);
        isReconnecting = false;
    });

    // معالج انقطاع الاتصال
    connection.onclose((error) => {
        console.error('SignalR connection closed', error);
        if (!isReconnecting) {
            console.log('Attempting to reconnect...');
            startConnection(currentToken);
        }
    });

    // تسجيل معالج الأحداث المخصصة
    Object.keys(eventCallbacks).forEach(eventName => {
        connection.on(eventName, (...args) => {
            eventCallbacks[eventName].forEach(callback => {
                try {
                    callback(...args);
                } catch (err) {
                    console.error(`Error in ${eventName} callback:`, err);
                }
            });
        });
    });
};

/**
 * إيقاف الاتصال
 * @returns {Promise<void>}
 */
export const stopConnection = async () => {
    if (connection) {
        try {
            if (connection.state !== signalR.HubConnectionState.Disconnected) {
                await connection.stop();
                console.log('SignalR connection stopped');
            }
        } catch (err) {
            console.error('Error while stopping connection:', err);
        } finally {
            connection = null;
            isReconnecting = false;
        }
    }
};

/**
 * إضافة معالج لأحداث Hub
 * @param {string} eventName - اسم الحدث
 * @param {Function} callback - دالة المعالجة
 */
export const on = (eventName, callback) => {
    if (eventCallbacks[eventName]) {
        eventCallbacks[eventName].push(callback);
    } else {
        console.warn(`Unknown event name: ${eventName}`);
    }
};

/**
 * إزالة معالج لأحداث Hub
 * @param {string} eventName - اسم الحدث
 * @param {Function} callback - دالة المعالجة
 */
export const off = (eventName, callback) => {
    if (eventCallbacks[eventName]) {
        eventCallbacks[eventName] = eventCallbacks[eventName].filter(cb => cb !== callback);
    }
};

/**
 * بدء محادثة جديدة
 * @param {string} user2Id - معرف المستخدم الثاني
 * @returns {Promise<void>}
 */
export const startConversation = async (user2Id) => {
    if (!connection) {
        throw new Error('SignalR connection is not established');
    }

    try {
        await connection.invoke('StartConversation', user2Id);
    } catch (err) {
        console.error('Error starting conversation:', err);
        throw err;
    }
};

/**
 * إرسال رسالة
 * @param {string} conversationId - معرف المحادثة
 * @param {string} messageContent - محتوى الرسالة
 * @returns {Promise<void>}
 */
export const sendMessage = async (conversationId, messageContent) => {
    if (!connection) {
        throw new Error('SignalR connection is not established');
    }

    try {
        await connection.invoke('SendMessage', conversationId, messageContent);
    } catch (err) {
        console.error('Error sending message:', err);
        throw err;
    }
};

/**
 * الحصول على حالة الاتصال
 * @returns {string} - حالة الاتصال
 */
export const getConnectionState = () => {
    if (!connection) return 'Disconnected';
    return connection.connectionState;
};

/**
 * الحصول على معرف الاتصال
 * @returns {string|null} - معرف الاتصال
 */
export const getConnectionId = () => {
    if (!connection) return null;
    return connection.connectionId;
};

// تصدير الدوال المطلوبة
export default {
    startConnection,
    stopConnection,
    startConversation,
    sendMessage,
    on,
    off,
    getConnectionState,
    getConnectionId
};