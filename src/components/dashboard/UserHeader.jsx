import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Person, School } from '@mui/icons-material';
import { useSelector } from 'react-redux'; // استيراد useSelector

const UserHeader = () => { // إزالة userData من الـ props
  const { firstName, lastName, userType, points } = useSelector((state) => state.user);

  // تحضير البيانات المطلوبة
  const userData = {
    name: `${firstName} ${lastName}`,
    level: userType === 'student' ? 'طالب' : 'مستخدم', // يمكنك تعديل هذا حسب احتياجاتك
    points: points || 0, // افترض أن النقاط مخزنة في الـ state
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)',
      p: 3,
      borderRadius: 2,
      boxShadow: 3
    }}>
      <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontFamily: "'Tajawal', sans-serif" }}>
          مرحباً، {userData.name}
        </Typography>
        <Typography color="text.secondary" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
          استمر في التعلم لتحسين نطقك
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
        <Chip
          icon={<Person />}
          label={userData.level}
          variant="outlined"
          sx={{
            bgcolor: 'background.paper',
            fontFamily: "'Tajawal', sans-serif"
          }}
        />
        <Chip
          icon={<School />}
          label={`${userData.points} نقطة`}
          color="warning"
          sx={{
            color: 'text.primary',
            fontFamily: "'Tajawal', sans-serif"
          }}
        />
      </Box>
    </Box>
  );
};

export default UserHeader;