// this is not used , now its in the main navbar when logged in 

import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Person, School } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const UserHeader = () => {
  const { firstName, lastName, userType, points } = useSelector((state) => state.user);

  const userData = {
    name: `${firstName} ${lastName}`,
    level: userType === 'student' ? 'طالب' : 'مستخدم',
    points: points || 0,
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
      p: 1,
      px: 4,
      borderRadius: 3,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-10px)',
      transition: 'all 0.3s ease'
    }}>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontFamily: "'Tajawal', sans-serif",
            fontWeight: 700,
            fontSize: '1.2rem',
            color: 'text.primary',
            mb: 0.5
          }}
        >
          مرحباً، {userData.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontFamily: "'Tajawal', sans-serif",
            fontSize: '0.8rem'
          }}
        >
          استمر في التعلم لتحسين نطقك
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mt: { xs: 2, md: 0 },
        alignItems: 'center'
      }}>
        <Chip
          icon={<Person fontSize="small" />}
          label={userData.level}
          variant="outlined"
          sx={{
            bgcolor: 'background.paper',
            fontFamily: "'Tajawal', sans-serif",
            fontSize: '0.8rem',
            height: 32
          }}
        />
        <Chip
          icon={<School fontSize="small" />}
          label={`${userData.points} نقطة`}
          color="warning"
          sx={{
            color: 'text.primary',
            fontFamily: "'Tajawal', sans-serif",
            fontSize: '0.8rem',
            height: 32
          }}
        />
      </Box>
    </Box>
  );
};

export default UserHeader;