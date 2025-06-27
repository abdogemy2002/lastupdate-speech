import React from 'react';
import { Grid, Card, CardContent, Avatar, Typography, LinearProgress } from '@mui/material';
import { Equalizer, School, Mic, } from '@mui/icons-material';
import Box from '@mui/material/Box';
const StatsCards = ({ userData }) => {
  const stats = [
    {
      icon: <Equalizer />,
      title: "تقدمك",
      value: `${userData.progress}%`,
      color: 'primary.light',
      progress: userData.progress
    },
    {
      icon: <School />,
      title: "الدروس المكتملة",
      value: userData.completedLessons,
      color: 'success.light',
      description: "+3 دروس هذا الأسبوع"
    },
    {
      icon: <Mic />,
      title: "أيام متتالية",
      value: userData.streak,
      color: 'error.light',
      description: "لا تنقطع عن التعلم!"
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card sx={{ 
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h6" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
              {stat.progress && (
                <LinearProgress 
                  variant="determinate" 
                  value={stat.progress} 
                  sx={{ height: 8 }}
                />
              )}
              {stat.description && (
                <Typography color="text.secondary" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                  {stat.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards;