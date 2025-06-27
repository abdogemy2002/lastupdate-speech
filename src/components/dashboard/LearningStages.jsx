import React from 'react';
import { Card, CardHeader, CardContent, Grid, Avatar, Typography, Chip } from '@mui/material';
import { EmojiObjects, RecordVoiceOver, Forum } from '@mui/icons-material';

const LearningStages = ({ stages }) => {
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
          {stages.map(stage => (
            <Grid item xs={12} md={4} key={stage.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: stage.current ? '2px solid' : 'none',
                  borderColor: stage.current ? 'primary.main' : 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      bgcolor: stage.completed ? 'success.light' : 'grey.100',
                      mb: 2,
                      mx: 'auto'
                    }}
                  >
                    {stage.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                    {stage.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2, fontFamily: "'Tajawal', sans-serif" }}>
                    {stage.description}
                  </Typography>
                  {stage.completed && (
                    <Chip 
                      label="مكتمل" 
                      color="success" 
                      size="small" 
                      sx={{ fontFamily: "'Tajawal', sans-serif" }}
                    />
                  )}
                  {stage.current && (
                    <Chip 
                      label="جاري العمل" 
                      color="primary" 
                      size="small" 
                      sx={{ fontFamily: "'Tajawal', sans-serif" }}
                    />
                  )}
                  {!stage.completed && !stage.current && (
                    <Chip 
                      label="قفل" 
                      color="default" 
                      size="small" 
                      sx={{ fontFamily: "'Tajawal', sans-serif" }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LearningStages;