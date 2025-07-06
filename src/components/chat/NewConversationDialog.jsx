import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
    Typography
} from '@mui/material';

const NewConversationDialog = ({
    open,
    onClose,
    newConversationUserId,
    setNewConversationUserId,
    handleStartNewConversation,
    error,
    loading
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'center', fontFamily: 'Tajawal, sans-serif' }}>
                بدء محادثة جديدة
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="معرف المستخدم"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={newConversationUserId}
                    onChange={(e) => setNewConversationUserId(e.target.value)}
                    sx={{ mt: 2, fontFamily: 'Tajawal, sans-serif' }}
                />
                {error && (
                    <Typography color="error" sx={{ mt: 1, fontFamily: 'Tajawal, sans-serif' }}>
                        {error}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{ fontFamily: 'Tajawal, sans-serif', color: '#757575' }}
                >
                    إلغاء
                </Button>
                <Button
                    onClick={handleStartNewConversation}
                    disabled={loading || !newConversationUserId}
                    variant="contained"
                    sx={{
                        backgroundColor: '#20B2AA',
                        color: 'white',
                        fontFamily: 'Tajawal, sans-serif',
                        '&:hover': { backgroundColor: '#1E9C96' },
                        '&:disabled': { backgroundColor: '#cccccc' }
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                        'بدء المحادثة'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewConversationDialog;