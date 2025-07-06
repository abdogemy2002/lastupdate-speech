import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  TextField 
} from '@mui/material';

const NewConversationDialog = ({ 
  open, 
  onClose, 
  newConversationUserId, 
  setNewConversationUserId, 
  handleStartNewConversation 
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle sx={{ 
      backgroundColor: '#FFA726',
      color: 'white',
      fontFamily: "'Kidzhood Arabic', Arial, sans-serif",
      fontWeight: 'bold'
    }}>
      بدء محادثة جديدة
    </DialogTitle>
    <DialogContent sx={{ mt: 2 }}>
      <Box sx={{ p: 2 }}>
        <TextField
          autoFocus
          margin="dense"
          label="معرف المستخدم"
          type="text"
          fullWidth
          variant="outlined"
          value={newConversationUserId}
          onChange={(e) => setNewConversationUserId(e.target.value)}
          placeholder="أدخل معرف المستخدم لبدء المحادثة"
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: "'Tajawal', sans-serif"
            },
            '& .MuiInputLabel-root': {
              fontFamily: "'Tajawal', sans-serif"
            }
          }}
        />
      </Box>
    </DialogContent>
    <DialogActions sx={{ p: 2, backgroundColor: '#FFF8E1' }}>
      <Button 
        onClick={onClose}
        sx={{
          fontFamily: "'Tajawal', sans-serif",
          color: '#E65100',
          fontWeight: 'bold'
        }}
      >
        إلغاء
      </Button>
      <Button
        onClick={handleStartNewConversation}
        variant="contained"
        disabled={!newConversationUserId.trim()}
        sx={{
          fontFamily: "'Tajawal', sans-serif",
          backgroundColor: '#20B2AA',
          color: 'white',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#00897B'
          },
          '&:disabled': {
            backgroundColor: '#B2DFDB'
          }
        }}
      >
        بدء المحادثة
      </Button>
    </DialogActions>
  </Dialog>
);

export default NewConversationDialog;