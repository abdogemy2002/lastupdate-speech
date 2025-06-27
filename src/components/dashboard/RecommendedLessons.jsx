import React from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, Button, Box } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const RecommendedLessons = ({ lessons }) => {
  return (
    <Card sx={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)'
    }}>
      <CardHeader 
        title="دروس مقترحة لك" 
        titleTypographyProps={{ 
          variant: 'h5',
          sx: { fontFamily: "'Tajawal', sans-serif" }
        }}
      />
      <CardContent>
        <Grid container spacing={3}>
          {lessons.map((lesson, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  transition: 'transform 0.3s ease'
                }
              }}>
                <Box
                  component="img"
                  src={lesson.image}
                  alt={lesson.title}
                  sx={{ 
                    height: 160,
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                    {lesson.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mb: 2,
                    fontFamily: "'Tajawal', sans-serif"
                  }}>
                    {lesson.description}
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth
                    endIcon={<ArrowForward />}
                    sx={{ fontFamily: "'Tajawal', sans-serif" }}
                  >
                    ابدأ الدرس
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RecommendedLessons;