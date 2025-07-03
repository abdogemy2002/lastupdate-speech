import React from 'react';
import { Card, CardHeader, CardContent, Grid, Typography, IconButton, Box } from '@mui/material';
import { Lock, ArrowForwardIos } from '@mui/icons-material';

const LearningStages = ({ stages }) => {
  const levelsData = [
    {
      id: 1,
      title: "المستوى الأول",
      description: "هتتعلم نطق الكلمات صح عن طريق السمع والتكرار.",
      unlocked: true,
      color: "#FFA726", // Orange
      icon: <ArrowForwardIos />
    },
    {
      id: 2,
      title: "المستوى الثاني",
      description: "هتتدرب على نطق جمل بسيطة وسهلة.",
      unlocked: false,
      color: "#BDBDBD", // Gray
      icon: <Lock />
    },
    {
      id: 3,
      title: "المستوى الثالث",
      description: "هتتحدى نفسك وتنطق جمل أطول وأصعب.",
      unlocked: false,
      color: "#BDBDBD",
      icon: <Lock />
    }
  ];

  return (
    <Card sx={{ 
      mb: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)'
    }}>
      <CardHeader 
        title="المراحل التعليمية" 
        titleTypographyProps={{ 
          variant: 'h5',
          sx: { fontFamily: "'Tajawal', sans-serif" }
        }}
      />
      <CardContent>
        <Grid container spacing={3}>
          {levelsData.map(level => (
            <Grid item xs={12} md={4} key={level.id}>
              <Card 
                sx={{ 
                  backgroundColor: level.color,
                  color: "#fff",
                  borderRadius: "16px",
                  boxShadow: 3,
                  opacity: level.unlocked ? 1 : 0.7,
                  transition: "0.3s",
                  cursor: level.unlocked ? "pointer" : "default",
                  height: "100%",
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3
                }}
              >
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}>
                  {/* Icon */}
                  <IconButton
                    sx={{
                      color: "#fff",
                      alignSelf: 'center',
                      mb: 2
                    }}
                  >
                    {level.icon}
                  </IconButton>
                  
                  {/* Title */}
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    sx={{ 
                      fontFamily: "'Tajawal', sans-serif",
                      textAlign: 'center',
                      mb: 1
                    }}
                  >
                    {level.title}
                  </Typography>
                  
                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: "'Tajawal', sans-serif",
                      textAlign: 'center',
                      mt: 1
                    }}
                  >
                    {level.description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LearningStages;