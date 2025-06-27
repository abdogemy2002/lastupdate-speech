import React from 'react';
import { styled, Box, Typography } from '@mui/material';

const PromptContainer = styled(Box)(({ theme }) => ({
  width: '70%',
  minHeight: '140px', // زيادة الارتفاع قليلاً
  backgroundColor: '#FFF',
  borderRadius: '16px',
  border: 'none', // إزالة الحدود القديمة
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: `
    0 4px 20px rgba(24, 185, 192, 0.15),
    inset 0 0 0 1px rgba(24, 185, 192, 0.2)
  `,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    background: 'linear-gradient(135deg, rgba(24,185,192,0.1), rgba(252,164,60,0.1))',
    borderRadius: '18px',
    zIndex: -1,
    animation: 'gradientBorder 6s ease infinite',
  },
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    minHeight: '120px',
    padding: '16px'
  }
}));

const PromptText = styled(Typography)(({ theme }) => ({
  color: '#18b9c0',
  fontSize: '3rem', // زيادة حجم الخط
  fontWeight: 'bold',
  fontFamily: 'Kidzhood Arabic',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '3px',
    background: 'linear-gradient(90deg, #18b9c0, #FCA43C)',
    borderRadius: '3px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
    '&::after': {
      width: '40px',
      height: '2px'
    }
  }
}));

// إضافة الكيframes في styled-components
const GlobalStyles = styled('style')({
  '@keyframes gradientBorder': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' }
  }
});

const PromptDisplay = ({ prompt }) => {
  return (
    <>
      <GlobalStyles />
      <PromptContainer>
        <PromptText>
          {prompt || '👈 سيظهر هنا النص المطلوب نطقه'}
        </PromptText>
      </PromptContainer>
    </>
  );
};

export default PromptDisplay;