import React from 'react';
import {
  Card, CardHeader, CardContent, Typography, IconButton, Box,
  Button, useTheme
} from '@mui/material';
import { ArrowForward, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useRef } from 'react';

const RecommendedLessons = ({ lessons }) => {
  const lessonsContainerRef = useRef(null);
  const theme = useTheme();

  const scrollLessons = (direction) => {
    if (lessonsContainerRef.current) {
      const container = lessonsContainerRef.current;
      const cardWidth = container.children[0].offsetWidth;
      const gap = 24;
      const scrollAmount = cardWidth + gap;

      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Card sx={{
      mb: 4,
      backgroundColor: '#20B2AA',
      backdropFilter: 'blur(5px)',
      position: 'relative',
      borderRadius: '16px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0'
    }}>
      <CardHeader
        title="دروس مقترحة لك"
        titleTypographyProps={{
          variant: 'h5',
          sx: {
            fontFamily: "'Tajawal', sans-serif",
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'right',
          }
        }}
      />
      <CardContent sx={{ position: 'relative' }}>
        <Box sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          p: 2,
          py: 2,
          border: '3px solid #FCA43C',
          boxShadow: '0 2px 8px rgba(219, 0, 0, 0.05)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%', px: 3 }}>
            <IconButton
              onClick={() => scrollLessons('left')}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0)',
                color: '#444',
                borderRadius: '50%',
                border: '1px solidrgba(224, 224, 224, 0)',
              }}
            >
              <ChevronLeft fontSize="large" />
            </IconButton>

            <Box
              ref={lessonsContainerRef}
              sx={{
                display: 'flex',
                overflowX: 'auto',
                gap: 3,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                width: '100%',
                scrollSnapType: 'x mandatory',
                scrollPadding: '0 16px',
                px: 1,
                msOverflowStyle: 'none',
              }}
            >
              {lessons.map((lesson, index) => (
                <Box key={index} sx={{
                  minWidth: { xs: '100%', sm: '80%', md: '45%', lg: '22%' },
                  flexShrink: 0,
                  scrollSnapAlign: 'start'
                }}>
                  <Card
                    sx={{
                      backgroundColor: '#20B2AA',
                      minWidth: '350px',
                      color: "#fff",
                      borderRadius: "16px",
                      border: '3px solidrgba(174, 120, 55, 0)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      transition: "0.3s",
                      cursor: "pointer",
                      height: "100%",
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3,
                      '&:hover': { transform: 'scale(1.02)' }
                    }}
                  >
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexGrow: 1,
                        width: '100%',
                        minHeight: '150px',
                      }}>
                        <Box
                          component="img"
                          src={lesson.image}
                          alt={lesson.title}
                          sx={{
                            height: 150,
                            width: 'auto',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            borderRadius: '12px',

                          }}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'center', width: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{
                          fontFamily: "'Tajawal', sans-serif",
                          mb: 1
                        }}>
                          {lesson.title}
                        </Typography>
                        <Typography variant="body2" sx={{
                          fontFamily: "'Tajawal', sans-serif",
                          mb: 2
                        }}>
                          {lesson.description}
                        </Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          endIcon={<ArrowForward />}
                          sx={{
                            fontFamily: "'Tajawal', sans-serif",
                            backgroundColor: '#FCA43C',
                            '&:hover': {
                              backgroundColor: '#e6912e'
                            }
                          }}
                        >
                          ابدأ الدرس
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>

            <IconButton
              onClick={() => scrollLessons('right')}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0)',
                color: '#444',
                borderRadius: '50%',
                border: '1px solid rgba(224, 224, 224, 0)',
              }}
            >
              <ChevronRight fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecommendedLessons;