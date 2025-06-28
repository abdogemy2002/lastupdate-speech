import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  IconButton,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { logout, loginSuccess } from '../store/slices/userSlice';
import '../style/OffCanvasSidebar.css';

function OffCanvasSidebar({ show, onHide }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const [userData, setUserData] = useState({
    firstName: '',
    email: '',
    profileImageUrl: ''
  });

  useEffect(() => {
    if (user && user.firstName) {
      setUserData({
        firstName: user.firstName,
        email: user.email,
        profileImageUrl: user.profileImageUrl
      });
    } else {
      const persisted = localStorage.getItem('persist:root');
      if (persisted) {
        try {
          const parsed = JSON.parse(persisted);
          const storedUser = JSON.parse(parsed.user);
          if (storedUser && storedUser.isAuthenticated) {
            dispatch(loginSuccess(storedUser));
            setUserData({
              firstName: storedUser.firstName,
              email: storedUser.email,
              profileImageUrl: storedUser.profileImageUrl
            });
          }
        } catch (e) {
          console.error('❌ فشل تحميل بيانات المستخدم من localStorage:', e);
        }
      }
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    setUserData({
      firstName: '',
      email: '',
      profileImageUrl: ''
    });
    onHide();
    navigate("/");
  };

  // دالة جديدة للتعامل مع نقر تعديل الملف الشخصي
  const handleEditProfile = () => {
    onHide(); // إغلاق السايدبار أولاً
    navigate("/UpdateProfile "); // الانتقال لصفحة التعديل
  };

  return (
    <Drawer
      anchor="right"
      open={show}
      onClose={onHide}
      PaperProps={{
        sx: {
          width: 320,
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">الملف الشخصي</Typography>
          <IconButton onClick={onHide} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Profile Section */}
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Avatar
            src={userData.profileImageUrl || 'src/assets/user-img.jpg'}
            alt="User Avatar"
            sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            {userData.firstName || 'الاسم غير متوفر'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userData.email || 'بريد إلكتروني غير متوفر'}
          </Typography>
        </Box>

        <Divider />

        <List sx={{ py: 2 }}>
          <ListItem button onClick={handleEditProfile}>
            <ListItemIcon><EditIcon /></ListItemIcon>
            <ListItemText primary="تعديل الملف الشخصي" />
          </ListItem>
          <ListItem button component="a" href="#settings">
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="الإعدادات" />
          </ListItem>
          <ListItem button component="a" href="#activity-log">
            <ListItemIcon><HistoryIcon /></ListItemIcon>
            <ListItemText primary="سجل الأنشطة" />
          </ListItem>
        </List>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            تسجيل الخروج
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

export default OffCanvasSidebar;