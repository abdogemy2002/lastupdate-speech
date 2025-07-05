import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Avatar,
  Typography,
  Chip,
  Button,
  Paper,
  Box,
  Alert
} from '@mui/material';
import { Star, ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';
import { useNavigate } from 'react-router-dom';

const DoctorsCarousel = ({ doctors }) => {
  const navigate = useNavigate();

  // في حال عدم توفر أطباء
  if (!doctors || doctors.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 4 }}>
        لا يوجد أطباء متاحين حالياً
      </Alert>
    );
  }

  return (
    // الكارت الخارجي الكامل للكاروسيل
    <Card
      sx={{
        mb: 4,
        backgroundColor: '#20B2AA', // لون برتقالي رئيسي
        backdropFilter: 'blur(5px)', // تأثير ضبابي بسيط
        position: 'relative',
        borderRadius: '16px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)' // ظل ناعم
      }}
    >
      {/* زر التنقل إلى صفحة المزيد */}
      <Button
        variant="text"
        startIcon={<ArrowBackIos />}
        onClick={() => navigate('/PatientDashboard/specialists')}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 2,
          fontFamily: "'Tajawal', sans-serif",
          color: '#fff',
          fontWeight: 'bold',
          alignItems: 'center',
        }}
      >
        المزيد
      </Button>

      {/* العنوان الرئيسي للكارت */}
      <CardHeader
        title="الأطباء المقترحين"
        titleTypographyProps={{
          variant: 'h5',
          sx: {
            fontFamily: "'Tajawal', sans-serif",
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'right',

          }
        }}
      />

      {/* محتوى الكارت الذي يحتوي على الكاروسيل */}
      <CardContent>
        <Carousel
          direction="rtl"
          animation="slide"
          navButtonsAlwaysVisible
          indicators={false}
          duration={1000}
          interval={8000}
          swipe
          cycleNavigation
          fullHeightHover
          NextIcon={<ArrowForwardIos />} // أيقونة التالي
          PrevIcon={<ArrowBackIos />}   // أيقونة السابق
          navButtonsProps={{
            style: {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: '#444',
              borderRadius: '50%'
            }
          }}
        >
          {/* عنصر تكراري لكل طبيب داخل السلايدر */}
          {doctors.map((doctor) => (
            <Paper
              key={doctor.id}
              sx={{
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.95)', // خلفية فاتحة
                borderRadius: '16px',
                border: '3px solid #FCA43C',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* تخطيط الشبكة لعرض صورة الطبيب والمعلومات */}
              <Grid container spacing={2}>
                {/* صورة الطبيب */}
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                    src={doctor.image}
                    sx={{ width: 260, height: 260, border: '6px solid #FCA43C' }}
                  />
                </Grid>

                {/* معلومات الطبيب */}
                <Grid item xs={12} md={8}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Box>
                      {/* اسم الطبيب */}
                      <Typography
                        variant="h6"
                        sx={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 'bold' }}
                      >
                        {doctor.name}
                      </Typography>

                      {/* التخصص */}
                      <Typography
                        color="text.secondary"
                        sx={{ fontFamily: "'Tajawal', sans-serif" }}
                      >
                        {doctor.specialty}
                      </Typography>

                      {/* المدينة (اختياري) */}
                      {doctor.city && (
                        <Typography
                          color="text.secondary"
                          sx={{ fontFamily: "'Tajawal', sans-serif", mt: 1 }}
                        >
                          {doctor.city}
                        </Typography>
                      )}
                    </Box>

                    {/* تقييم الطبيب */}
                    <Chip
                      icon={<Star />}
                      label={doctor.rating.toFixed(1)}
                      color="warning"
                      sx={{ fontFamily: "'Tajawal', sans-serif" }}
                    />
                  </Box>

                  {/* ساعات العمل */}
                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 1, fontFamily: "'Tajawal', sans-serif" }}
                  >
                    ساعات العمل: {doctor.workingHours}
                  </Typography>

                  {/* الأيام المتاحة */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mt: 1, fontFamily: "'Tajawal', sans-serif",
                    }}
                  >
                    الأيام المتاحة:
                  </Typography>

                  {/* شارات الأيام */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
                    {doctor.availableSlots.map((slot, index) => (
                      <Chip
                        key={index}
                        label={slot}
                        variant="outlined"
                        sx={{
                          fontFamily: "'Tajawal', sans-serif",
                          backgroundColor: '#B3E5FC',
                          borderColor: '#B3E5FC',
                        }}
                      />
                    ))}
                  </Box>

                  {/* الأزرار: حجز وملف شخصي */}
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        fontFamily: "'Tajawal', sans-serif",
                        color: '#FCA43C',
                        borderColor: '#FCA43C',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#FFB74D',
                          color: '#fff',
                          borderColor: '#FFB74D',
                        }
                      }}
                    >
                      حجز موعد
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        fontFamily: "'Tajawal', sans-serif",
                        backgroundColor: '#FCA43C',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#FFB74D',
                        }
                      }}
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
