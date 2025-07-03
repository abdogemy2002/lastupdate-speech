import React from 'react';
import { Card, CardHeader, CardContent, Grid, Avatar, Typography, Chip, Button, Paper, Box, Alert } from '@mui/material';
import { Star, ArrowForwardIos } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';
import { useNavigate } from 'react-router-dom';

const DoctorsCarousel = ({ doctors }) => {
  const navigate = useNavigate();

  if (!doctors || doctors.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 4 }}>
        لا يوجد أطباء متاحين حالياً
      </Alert>
    );
  }

  return (
    <Card sx={{
      mb: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)',
      position: 'relative'
    }}>
      <Button
        variant="text"
        endIcon={<ArrowForwardIos />}
        onClick={() => navigate('/PatientDashboard/specialists')}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2,
          fontFamily: "'Tajawal', sans-serif",
          color: 'primary.main'
        }}
      >
        المزيد
      </Button>

      <CardHeader
        title="الأطباء المقترحين"
        titleTypographyProps={{
          variant: 'h5',
          sx: { fontFamily: "'Tajawal', sans-serif" }
        }}
      />
      <CardContent>
        <Carousel
          animation="slide"
          navButtonsAlwaysVisible
          indicators={false}
          duration={500}
          interval={5000}
          swipe
          cycleNavigation
          fullHeightHover
          NextIcon={<ArrowForwardIos />}
          PrevIcon={<ArrowForwardIos />}
        >
          {doctors.map(doctor => (
            <Paper key={doctor.id} sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                    src={doctor.image}
                    sx={{ width: 150, height: 150 }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2
                  }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                        {doctor.name}
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                        {doctor.specialty}
                      </Typography>
                      {doctor.city && (
                        <Typography color="text.secondary" sx={{ fontFamily: "'Tajawal', sans-serif", mt: 1 }}>
                          {doctor.city}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      icon={<Star />}
                      label={doctor.rating.toFixed(1)}
                      color="warning"
                      sx={{ fontFamily: "'Tajawal', sans-serif" }}
                    />
                  </Box>
                  
                  <Typography variant="subtitle2" sx={{ mt: 2, fontFamily: "'Tajawal', sans-serif" }}>
                    ساعات العمل: {doctor.workingHours}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ mt: 2, fontFamily: "'Tajawal', sans-serif" }}>
                    الأيام المتاحة:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                    {doctor.availableSlots.map((slot, index) => (
                      <Chip
                        key={index}
                        label={slot}
                        variant="outlined"
                        sx={{ fontFamily: "'Tajawal', sans-serif" }}
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ fontFamily: "'Tajawal', sans-serif" }}
                    >
                      حجز موعد
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ fontFamily: "'Tajawal', sans-serif" }}
                    >
                      عرض الملف الشخصي
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default DoctorsCarousel;