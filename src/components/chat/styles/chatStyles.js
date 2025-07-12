// styles/chatStyles.js
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, ListItem, Avatar, TextField, IconButton } from '@mui/material';

// Main chat container - حاوية الدردشة الرئيسية
export const ChatContainer = styled('div')({
    display: 'flex',
    height: '90vh',
    backgroundColor: '#FDFBF6', // Light background color - لون خلفية خفيف
    overflow: 'hidden',
});

// Sidebar for conversations list - الشريط الجانبي لقائمة المحادثات
export const Sidebar = styled(Box)(({ theme }) => ({
    width: 300,
    hight: '100%',
    borderRight: `1px solid ${theme.palette.divider}`,
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
}));

// Main content area (messages + input) - منطقة المحتوى الرئيسي (الرسائل + الإدخال)
export const MainContent = styled(Box)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
});

// Area where messages are displayed - منطقة عرض الرسائل
export const MessageArea = styled(Box)({
    flex: 1,
    padding: 16,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: 'url("../../../assets/flower-bg.jpg")',
    backgroundSize: 'cover', // أو contain حسب ما تحب
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
});

// Input area at the bottom - منطقة الإدخال في الأسفل
export const MessageInputArea = styled(Box)({
    padding: '8px 12px',
    // borderTop: '1px solid #ccc',
    backgroundColor: '#fafafa',
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
});

// Centered box for empty states - صندوق منسق في المركز للحالات الفارغة
export const CenteredBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    textAlign: 'center',
    padding: 24,
    backgroundColor: '#FDFBF6',
});

// Box shown when no messages exist - صندوق يظهر عندما لا توجد رسائل
export const EmptyMessageBox = styled(Box)({
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 24,
    flexDirection: 'column',
    color: '#555',
    fontFamily: "'Tajawal', sans-serif",
});

// Box shown when no conversations exist - صندوق يظهر عندما لا توجد محادثات
export const EmptyListBox = styled('div')({
    padding: 24,
    textAlign: 'center',
    fontFamily: "'Tajawal', sans-serif",
});

// Message bubble component - فقاعة الرسالة
export const Bubble = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isCurrentUser',
})(({ isCurrentUser }) => ({
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: isCurrentUser ? '16px ' : '16px',
    marginBottom: 8,
    alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
    backgroundColor: isCurrentUser ? '#20B2AA' : '#FFA726',
    color: '#fff',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    position: 'relative',
    wordBreak: 'break-word',
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 0,
        height: 0,
        bottom: 0, // To make the arrow appear at bottom - لجعل السهم يظهر في الأسفل
        borderStyle: 'solid',
        borderWidth: isCurrentUser ? '0 0 12px 12px' : '0 12px 12px 0',
        borderColor: isCurrentUser
            ? 'transparent transparent #20B2AA transparent'
            : 'transparent transparent #FFA726 transparent',
        right: isCurrentUser ? '-0px' : 'auto',
        left: isCurrentUser ? 'auto' : '-0px',
    },
}));

// Date separator between messages - فاصل التاريخ بين الرسائل
export const DateBox = styled(Box)(() => ({
    alignSelf: 'center',
    margin: '16px 0',
    borderRadius: '20px',
    fontFamily: "'Tajawal', sans-serif",
    color: 'rgba(0, 0, 0, 0.57)',
    fontSize: '0.75rem',
    fontWeight: 500,
}));

// Connection status wrapper - غلاف حالة الاتصال
export const ConnectionWrapper = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    padding: 16,
});

// Connection status indicator - مؤشر حالة الاتصال
export const StatusBox = styled(Box)(({ status }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: 20,
    backgroundColor:
        status === 'connected'
            ? '#4caf50'
            : status === 'connecting'
                ? '#ff9800'
                : '#f44336',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 500,
    marginRight: 16,
}));

// Small dot in status indicator - النقطة الصغيرة في مؤشر الحالة
export const StatusDot = styled(Box)({
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 6,
    backgroundColor: 'white',
});

// ستايل الحاوية بتاعة input والزرار
export const InputWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',

    alignItems: 'center',
    padding: '8px 12px',
    borderTop: '1px solid #ccc',
    backgroundColor: '#fafafa',
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
    gap: 8,
});

// ستايل الـ TextField المستخدم في كتابة الرسالة
export const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: 16,
        backgroundColor: '#ffffff',
        fontFamily: "'Tajawal', sans-serif",
        '& fieldset': {
            borderColor: '#B2DFDB',
        },
        '&:hover fieldset': {
            borderColor: '#80CBC4',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#20B2AA',
        },
    },
});

// ستايل زر الإرسال
export const StyledSendButton = styled(IconButton)({
    backgroundColor: '#FFA726',
    color: '#fff',
    borderRadius: 12,
    padding: 10,
    '&:hover': {
        backgroundColor: '#FB8C00',
    },
    '&.Mui-disabled': {
        backgroundColor: '#FFE0B2',
        color: '#fff',
    },
});

// Text shown when no conversations exist - النص الظاهر عند عدم وجود محادثات
export const NoConversationsText = styled(Typography)({
    color: '#888',
    fontFamily: "'Tajawal', sans-serif",
    fontSize: '1rem',
});

// Button to start new conversation - زر بدء محادثة جديدة
export const StartConversationButton = styled(Button)({
    marginTop: 16,
    borderColor: '#FFA726',
    color: '#FFA726',
    fontFamily: "'Tajawal', sans-serif",
    '&:hover': {
        borderColor: '#FB8C00',
        backgroundColor: '#FFF3E0',
    },
});

// Single conversation item in list - عنصر محادثة فردي في القائمة
export const StyledListItem = styled(ListItem)(({ theme }) => ({
    padding: '12px 16px',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    maxHeight: 72,
    overflow: 'hidden',
}));

// User avatar in conversation list - صورة المستخدم في قائمة المحادثات
export const StyledAvatar = styled(Avatar)({
    bgcolor: '#20B2AA',
    width: 40,
    height: 40,
    border: '2px solid white',
    fontFamily: "'Tajawal', sans-serif"
});

// Username text style - نمط نص اسم المستخدم
export const StyledUserName = styled(Typography)({
    fontFamily: "'Tajawal', sans-serif",
    fontWeight: 'bold',
    color: '#00695C'
});

// Message preview text style - نمط نص معاينة الرسالة
export const StyledMessageText = styled(Typography)({
    fontFamily: "'Tajawal', sans-serif",
    color: '#0097A7',
    fontSize: '0.9rem',
    width: 200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
});

// Message time text style - نمط نص وقت الرسالة
export const StyledTimeText = styled(Typography)({
    fontFamily: "'Tajawal', sans-serif",
    color: '#0097A7'
});

// Unread messages counter - عداد الرسائل غير المقروءة
export const StyledUnreadCountBox = styled(Box)({
    backgroundColor: '#E65100',
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    fontFamily: "'Tajawal', sans-serif",
    fontWeight: 'bold',
    color: 'white',
    fontSize: '0.7rem'
});

// Unread badge style - نمط شارة غير مقروء
export const StyledUnreadBadge = {
    '& .MuiBadge-badge': {
        backgroundColor: '#E65100',
        color: 'white',
        fontFamily: "'Tajawal', sans-serif",
        fontWeight: 'bold'
    }
};
