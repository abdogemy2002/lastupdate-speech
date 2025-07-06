import React, { useEffect, useRef, useState } from 'react';
import { styled, Box } from '@mui/material';

const PromptDisplay = ({ prompt }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(32); // حجم افتراضي

  // دالة لتصغير أو تكبير الخط حسب المساحة
  const adjustFontSize = () => {
    const container = containerRef.current;
    const textElement = textRef.current;

    if (!container || !textElement) return;

    let newSize = 42; // ابدأ بحجم افتراضي
    textElement.style.fontSize = `${newSize}px`;

    while (
      (textElement.scrollWidth > container.clientWidth ||
        textElement.scrollHeight > container.clientHeight) &&
      newSize > 12
    ) {
      newSize -= 1;
      textElement.style.fontSize = `${newSize}px`;
    }

    setFontSize(newSize);
  };

  useEffect(() => {
    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [prompt]);

  const PromptContainer = styled(Box)(({ theme }) => ({
    width: '70%',
    height: '140px',
    backgroundColor: '#FFF',
    borderRadius: '16px',
    border: 'none',
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
      height: '120px',
      padding: '16px'
    }
  }));

  const PromptText = styled('div')(({ theme }) => ({
    color: '#18b9c0',
    fontWeight: 'bold',
    fontFamily: '"Kidzhood Arabic", sans-serif',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative',
    width: '100%',
    padding: '0 10px',
    transition: 'font-size 0.3s ease',
    fontSize: `${fontSize}px`,
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
      '&::after': {
        width: '40px',
        height: '2px'
      }
    }
  }));

  const GlobalStyles = styled('style')({
    '@keyframes gradientBorder': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' }
    }
  });

  return (
    <>
      <GlobalStyles />
      <PromptContainer ref={containerRef}>
        <PromptText ref={textRef}>
          {prompt || '👈 سيظهر هنا النص المطلوب نطقه'}
        </PromptText>
      </PromptContainer>
    </>
  );
};

export default PromptDisplay;
