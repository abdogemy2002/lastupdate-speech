import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, Avatar, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import img1 from '../assets/image1.jpg';
import img2 from '../assets/image1.jpg'; 
import img3 from '../assets/image1.jpg';

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(32, 178, 170, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(32, 178, 170, 0); }
  100% { box-shadow: 0 0 0 0 rgba(32, 178, 170, 0); }
`;

// Styled components with Kidzhood Arabic font and new color scheme
const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(4),
  borderRadius: '24px',
  background: `linear-gradient(145deg, #fffaf0, #fffaf0)`, // Using warm-beige
  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
  position: 'relative',
  overflow: 'visible',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 12px 40px rgba(32, 178, 170, 0.2)`, // Using teal-green
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: '26px',
    background: `linear-gradient(45deg, #fca43c,#20B2AA)`, // teal-green to bright-orange
    zIndex: -1,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 0.3,
  },
  fontFamily: '"Kidzhood Arabic", "RTL Mocha Yemen Sadah", sans-serif',
}));

const FeatureIconContainer = styled('div')(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  position: 'relative',
  background: `linear-gradient(135deg, #20B2AA, #fca43c)`, // teal-green to bright-orange
  color: '#ffffff',
  boxShadow: `0 4px 20px rgba(32, 178, 170, 0.4)`, // teal-green
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    animation: `${pulseAnimation} 2s infinite`,
  },
}));

const FeatureImage = styled('img')({
  width: '100%',
  height: 180,
  objectFit: 'cover',
  borderRadius: '16px',
  marginBottom: '24px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
  },
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  position: 'relative',
  display: 'inline-block',
  fontFamily: '"Kidzhood Arabic", "RTL Mocha Yemen Sadah", sans-serif',
  fontWeight: 'bold',
  color: '#2b2b2b', // charcoal-grey
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -12,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: `linear-gradient(90deg, #20B2AA, #fca43c)`, // teal-green to bright-orange
    borderRadius: '2px',
  },
}));

const Features = () => {
  const theme = useTheme();
  
  const features = [
    {
      title: "التشخيص",
      text: "تحديد المشكلات بدقة من خلال تحليل النطق.",
      icon: <SearchIcon sx={{ fontSize: '2.5rem' }} />,
      imgSrc: img1,
    },
    {
      title: "خطط علاج شخصية",
      text: "تمارين مخصصة لكل حرف يواجه الطفل صعوبة في نطقه.",
      icon: <PersonSearchIcon sx={{ fontSize: '2.5rem' }} />,
      imgSrc: img2,
    },
    {
      title: "متابعة التقدم",
      text: "تقييمات دورية مع توصيات للتكرار أو التقدم.",
      icon: <TrendingUpIcon sx={{ fontSize: '2.5rem' }} />,
      imgSrc: img3,
    },
  ];

  return (
    <Box 
      component="section" 
      id="features"
      sx={{
        py: 10,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fffaf0', // warm-beige
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 20% 50%, rgba(32, 178, 170, 0.05) 0%, transparent 40%)', // teal-green
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <SectionTitle 
          variant="h2" 
          component="h2"
          sx={{
            fontSize: '2.5rem',
          }}
        >
          مميزاتنا
        </SectionTitle>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard elevation={0}>
                <FeatureImage 
                  src={feature.imgSrc} 
                  alt={feature.title}
                />
                <FeatureIconContainer>
                  {feature.icon}
                </FeatureIconContainer>
                <CardContent sx={{ px: 0 }}>
                  <Typography 
                    variant="h4" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 2,
                      fontFamily: '"Kidzhood Arabic", "RTL Mocha Yemen Sadah", sans-serif',
                      background: `linear-gradient(90deg, #20B2AA, #fca43c)`, // teal-green to bright-orange
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1.8rem',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="#2b2b2b" // charcoal-grey
                    sx={{ 
                      lineHeight: 1.7,
                      fontFamily: '"Kidzhood Arabic", "RTL Mocha Yemen Sadah", sans-serif',
                      fontSize: '1.1rem'
                    }}
                  >
                    {feature.text}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;