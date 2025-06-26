import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#444',
        color: '#ffffff',
        py: 4,
        borderTop: '5px solid #fca43c',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          sx={{
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
            px: isSmallMobile ? 1 : 3,
          }}
        >
          {/* Quick Links */}
          <Grid item xs={12} md={4} sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#20B2AA', fontSize: isSmallMobile ? '1.2rem' : 'inherit' }}
            >
              روابط سريعة
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: isSmallMobile ? 0.5 : 1 }}>
                <Link
                  href="#about"
                  sx={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    '&:hover': { color: '#fca43c' },
                    transition: 'color 0.3s',
                  }}
                >
                  عن الشركة
                </Link>
              </Box>
              <Box component="li" sx={{ mb: isSmallMobile ? 0.5 : 1 }}>
                <Link
                  href="#services"
                  sx={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    '&:hover': { color: '#fca43c' },
                    transition: 'color 0.3s',
                  }}
                >
                  الخدمات
                </Link>
              </Box>
              <Box component="li" sx={{ mb: isSmallMobile ? 0.5 : 1 }}>
                <Link
                  href="#membership"
                  sx={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    '&:hover': { color: '#fca43c' },
                    transition: 'color 0.3s',
                  }}
                >
                  خطط العضوية
                </Link>
              </Box>
              <Box component="li" sx={{ mb: isSmallMobile ? 0.5 : 1 }}>
                <Link
                  href="#contact"
                  sx={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    '&:hover': { color: '#fca43c' },
                    transition: 'color 0.3s',
                  }}
                >
                  اتصل بنا
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4} sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#20B2AA', fontSize: isSmallMobile ? '1.2rem' : 'inherit' }}
            >
              اتصل بنا
            </Typography>
            <Typography variant="body2" paragraph>
              البريد الإلكتروني: info@example.com
            </Typography>
            <Typography variant="body2">
              الهاتف: (123) 456-7890
            </Typography>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={4} sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#20B2AA', fontSize: isSmallMobile ? '1.2rem' : 'inherit' }}
            >
              تابعنا
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: isSmallMobile ? 1 : 2,
                justifyContent: isMobile ? 'center' : 'flex-start',
              }}
            >
              <IconButton
                sx={{
                  color: '#ffffff',
                  '&:hover': { color: '#fca43c' },
                  transition: 'color 0.3s',
                }}
                aria-label="فيسبوك"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ffffff',
                  '&:hover': { color: '#fca43c' },
                  transition: 'color 0.3s',
                }}
                aria-label="تويتر"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ffffff',
                  '&:hover': { color: '#fca43c' },
                  transition: 'color 0.3s',
                }}
                aria-label="إنستاجرام"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ffffff',
                  '&:hover': { color: '#fca43c' },
                  transition: 'color 0.3s',
                }}
                aria-label="لينكدإن"
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 3,
            borderColor: 'rgba(255,255,255,0.2)',
          }}
        />

        {/* Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: isSmallMobile ? '0.9rem' : 'inherit',
          }}
        >
          &copy; {new Date().getFullYear()} خواتنك. جميع الحقوق محفوظة.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;