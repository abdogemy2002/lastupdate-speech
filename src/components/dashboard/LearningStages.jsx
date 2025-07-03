import React, { useState, useRef } from 'react';
import {
  Card, CardHeader, CardContent, Typography, IconButton, Box,
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions
} from '@mui/material';
import { Lock, ArrowForwardIos, ChevronLeft, ChevronRight } from '@mui/icons-material';

const LearningStages = () => {
  const [openAssessment, setOpenAssessment] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(5).fill(null));
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const levelsContainerRef = useRef(null);

  const levelsData = [
    { id: 0, title: "تقييم سريع", description: "قبل ما تبدأ تدريب، اعمل اختبار سريع", unlocked: true, color: "#4CAF50", icon: <ArrowForwardIos />, isAssessment: true },
    { id: 1, title: "المستوى الأول", description: "هتتعلم نطق الكلمات صح عن طريق السمع والتكرار.", unlocked: true, color: "#FFA726", icon: <ArrowForwardIos />, isAssessment: false },
    { id: 2, title: "المستوى الثاني", description: "هتتدرب على نطق جمل بسيطة وسهلة.", unlocked: false, color: "#BDBDBD", icon: <Lock />, isAssessment: false },
    { id: 3, title: "المستوى الثالث", description: "هتتحدى نفسك وتنطق جمل أطول وأصعب.", unlocked: false, color: "#BDBDBD", icon: <Lock />, isAssessment: false }
  ];

  const assessmentQuestions = [
    "هل بتعاني من الخنف في نطقك؟",
    "هل عندك مشكلة في عدم وجود أسنان أمامية؟",
    "هل بتعاني من مشكلة العضة المفتوحة، يعني أسنانك العلوية والسفلية مش بينطبقوا على بعض؟",
    "هل عندك مشكلة العضة المعكوسة، يعني الفك السفلي أكبر من العلوي وده بيخلي الفك السفلي يطلع لبرا؟",
    "هل بتعاني من العضة المتقدمة، يعني الفك العلوي أكبر من السفلي وده بيخلي الفك العلوي يبرز لبرا؟"
  ];

  const handleOpenAssessment = () => {
    setOpenAssessment(true);
    setCurrentQuestion(0);
    setAnswers(Array(5).fill(null));
    setShowFinalScreen(false);
  };

  const handleCloseAssessment = () => {
    setOpenAssessment(false);
  };

  const handleAnswerChangeManual = (value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = value === 'yes';
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const hasYesAnswer = answers.includes(true);
      if (hasYesAnswer) {
        setShowFinalScreen(true); // Show custom end screen
      } else {
        setOpenAssessment(false); // Close normally
      }
    }
  };

  const scrollLevels = (direction) => {
    if (levelsContainerRef.current) {
      const container = levelsContainerRef.current;
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
    <Card sx={{ mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', position: 'relative', overflow: 'visible' }}>
      <CardHeader
        title="المراحل التعليمية"
        titleTypographyProps={{ variant: 'h5', sx: { fontFamily: "'Tajawal', sans-serif" } }}
      />
      <CardContent sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%', px: 3 }}>
          <IconButton
            onClick={() => scrollLevels('left')}
            sx={{
              position: 'absolute',
              left: -20,
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'white',
              boxShadow: 3,
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <ChevronLeft fontSize="large" />
          </IconButton>

          <Box
            ref={levelsContainerRef}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: 3,
              pb: 3,
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': { height: '6px', backgroundColor: 'rgba(0,0,0,0.05)' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' },
              width: '100%',
              scrollSnapType: 'x mandatory',
              scrollPadding: '0 16px',
              px: 1
            }}
          >
            {levelsData.map(level => (
              <Box key={level.id} sx={{ minWidth: { xs: '100%', sm: '80%', md: '45%', lg: '22%' }, flexShrink: 0, scrollSnapAlign: 'start' }}>
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
                    p: 3,
                    ...(level.isAssessment && { '&:hover': { transform: 'scale(1.02)' } })
                  }}
                  onClick={level.isAssessment ? handleOpenAssessment : undefined}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: '100%' }}>
                    <IconButton sx={{ color: "#fff", alignSelf: 'center', mb: 2 }} disabled={!level.unlocked}>
                      {level.icon}
                    </IconButton>
                    <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "'Tajawal', sans-serif", textAlign: 'center', mb: 1 }}>{level.title}</Typography>
                    <Typography variant="body2" sx={{ fontFamily: "'Tajawal', sans-serif", textAlign: 'center', mt: 1, flexGrow: 1 }}>{level.description}</Typography>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>

          <IconButton
            onClick={() => scrollLevels('right')}
            sx={{
              position: 'absolute',
              right: -20,
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'white',
              boxShadow: 3,
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <ChevronRight fontSize="large" />
          </IconButton>
        </Box>

        {/* Modal */}
        <Dialog
          open={openAssessment}
          onClose={handleCloseAssessment}
          fullWidth
          maxWidth="xs"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '20px',
              backgroundColor: '#fff',
              backgroundImage: 'url("/background-pattern.png")',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
              px: 2,
              py: 3,
            },
          }}
        >
          {!showFinalScreen ? (
            <>
              <DialogTitle
                sx={{
                  textAlign: 'center',
                  fontFamily: "'Tajawal', sans-serif",
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  color: '#444',
                }}
              >
                {currentQuestion + 1} / {assessmentQuestions.length}
              </DialogTitle>

              <DialogContent sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontFamily: "'Tajawal', sans-serif", fontSize: '1.1rem', color: '#333', mb: 3 }}>
                  {assessmentQuestions[currentQuestion]}
                </Typography>

                <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={2}>
                  <Button
                    variant={answers[currentQuestion] === true ? 'contained' : 'outlined'}
                    onClick={() => handleAnswerChangeManual('yes')}
                    sx={{
                      minWidth: 100, height: 60, fontSize: '1.1rem', fontWeight: 'bold',
                      fontFamily: "'Tajawal', sans-serif", borderRadius: '12px',
                      backgroundColor: answers[currentQuestion] === true ? '#FFD700' : '#fff',
                      color: answers[currentQuestion] === true ? '#000' : '#555',
                      border: '1px solid #FFD700',
                      boxShadow: answers[currentQuestion] === true ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    نعم
                  </Button>

                  <Button
                    variant={answers[currentQuestion] === false ? 'contained' : 'outlined'}
                    onClick={() => handleAnswerChangeManual('no')}
                    sx={{
                      minWidth: 100, height: 60, fontSize: '1.1rem', fontWeight: 'bold',
                      fontFamily: "'Tajawal', sans-serif", borderRadius: '12px',
                      backgroundColor: answers[currentQuestion] === false ? '#FFD700' : '#fff',
                      color: answers[currentQuestion] === false ? '#000' : '#555',
                      border: '1px solid #FFD700',
                      boxShadow: answers[currentQuestion] === false ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    لا
                  </Button>
                </Box>
              </DialogContent>

              <DialogActions sx={{ justifyContent: 'space-between', px: 3, pt: 2 }}>
                <Button onClick={handleCloseAssessment} sx={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 'bold', color: '#666' }}>
                  الرجوع
                </Button>
                <Button
                  onClick={handleNextQuestion}
                  disabled={answers[currentQuestion] === null}
                  variant="contained"
                  sx={{
                    backgroundColor: '#20B2AA', color: '#fff',
                    fontFamily: "'Tajawal', sans-serif", fontWeight: 'bold', px: 4,
                    '&:hover': { backgroundColor: '#1D9E9E' }
                  }}
                >
                  {currentQuestion < assessmentQuestions.length - 1 ? 'التالي' : 'إنهاء'}
                </Button>
              </DialogActions>
            </>
          ) : (
            // Final Screen if any "yes"
            <DialogContent sx={{ textAlign: 'center', py: 5 }}>
              {/* SVG Image Placeholder - Replace with your actual SVG */}
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  <img
                    src="/src/assets/docConsult.svg"
                    alt="Doctor Consultation"
                    width="200"
                    height="200"
                  />
                </Box>
              </Box>

              <Typography variant="h6" sx={{
                fontFamily: "'Tajawal', sans-serif",
                fontWeight: 'bold',
                fontSize: '1.3rem',
                color: '#E65100',
                mb: 3
              }}>
                بناءً على إجاباتك، من الأفضل مراجعة أخصائي قبل بدء التدريب.
              </Typography>
              <Button
                onClick={handleCloseAssessment}
                variant="contained"
                sx={{
                  backgroundColor: '#20B2AA',
                  color: '#fff',
                  fontFamily: "'Tajawal', sans-serif",
                  fontWeight: 'bold',
                  px: 4,
                  '&:hover': { backgroundColor: '#1D9E9E' }
                }}
              >
                حسنًا
              </Button>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LearningStages;