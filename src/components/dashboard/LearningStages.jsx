import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardHeader, CardContent, Typography, IconButton, Box,
  CircularProgress, Alert
} from '@mui/material';
import { Lock, ChevronLeft, ChevronRight } from '@mui/icons-material';
import Assessment from './levels/Assessment';
import AssessmentIcon from '../../assets/assessment.svg';
import Milestones1 from '../../assets/milestones1.svg';
import Milestones2 from '../../assets/milestones2.svg';
import Milestones3 from '../../assets/milestones3.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/userSlice'; // تأكد من المسار الصحيح

const LearningStages = () => {
  const [openAssessment, setOpenAssessment] = useState(false);
  const [currentUserLevel, setCurrentUserLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const levelsContainerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // جلب التوكن من Redux store
  const { token, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        // setLoading(true);
        
        if (!isAuthenticated || !token) {
          throw new Error('يجب تسجيل الدخول أولاً');
        }

        console.log('Fetching with token:', token); // لأغراض التصحيح

        const response = await fetch(
          'https://speech-correction-api.azurewebsites.net/api/training/progress',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Response status:', response.status);

        if (response.status === 401) {
          dispatch(logout());
          throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const progressData = await response.json();
        setCurrentUserLevel(progressData.highestUnlockedLevel || 0);
        
      } catch (error) {
        console.error('Error fetching user level:', error);
        setError(error.message);
        setCurrentUserLevel(0);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && token) {
      fetchUserLevel();
    } else {
      setError('يجب تسجيل الدخول للوصول إلى المراحل التعليمية');
    }
  }, [token, isAuthenticated, dispatch]);

  const handleLevelClick = async (levelId) => {
    if (levelId === 0) {
      handleOpenAssessment();
      return;
    }

    if (levelId > currentUserLevel + 1) {
      setError('هذا المستوى غير متاح بعد');
      return;
    }

    try {
      // setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://speech-correction-api.azurewebsites.net/api/training/level?level=${levelId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 401) {
        dispatch(logout());
        throw new Error('انتهت صلاحية الجلسة');
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const levelData = await response.json();
      handleNavigateToTraining(levelData);
      console.log('Level data:', levelData);
    } catch (error) {
      console.error('Error fetching level data:', error);
      setError(error.message || 'حدث خطأ أثناء جلب بيانات المستوى');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToTraining = (levelData) => {
    navigate('/levelDisplay', { state: { levelData } });
  };

  const getLevelsData = () => {
    const baseLevels = [
      {
        id: 0,
        title: "تقييم سريع",
        description: "قبل ما تبدأ تدريب، اعمل اختبار سريع",
        unlocked: true,
        color: "#FCA43C",
        icon: <img src={AssessmentIcon} alt="تقييم" width="150" height="150" />,
        isAssessment: true
      }
    ];

    const learningLevels = [
      {
        id: 1,
        title: "المستوى الأول",
        description: "هتتعلم نطق الكلمات صح عن طريق السمع والتكرار.",
        milestoneIcon: Milestones1
      },
      {
        id: 2,
        title: "المستوى الثاني",
        description: "هتتدرب على نطق جمل بسيطة وسهلة.",
        milestoneIcon: Milestones2
      },
      {
        id: 3,
        title: "المستوى الثالث",
        description: "هتتحدى نفسك وتنطق جمل أطول وأصعب.",
        milestoneIcon: Milestones3
      }
    ];

    learningLevels.forEach(level => {
      const unlocked = level.id <= currentUserLevel + 1;
      
      baseLevels.push({
        ...level,
        unlocked,
        color: unlocked ? "#20B2AA" : "#BDBDBD",
        icon: unlocked ?
          <img src={level.milestoneIcon} alt={`مستوى ${level.id}`} width="150" height="150" /> :
          <Lock sx={{ fontSize: 60 }} />,
        isAssessment: false
      });
    });

    return baseLevels;
  };

  const levelsData = getLevelsData();

  const assessmentQuestions = [
    "هل بتعاني من الخنف في نطقك؟",
    "هل عندك مشكلة في عدم وجود أسنان أمامية؟",
    "هل بتعاني من مشكلة العضة المفتوحة، يعني أسنانك العلوية والسفلية مش بينطبقوا على بعض؟",
    "هل عندك مشكلة العضة المعكوسة، يعني الفك السفلي أكبر من العلوي وده بيخلي الفك السفلي يطلع لبرا؟",
    "هل بتعاني من العضة المتقدمة، يعني الفك العلوي أكبر من السفلي وده بيخلي الفك العلوي يبرز لبرا؟"
  ];

  const handleOpenAssessment = () => {
    setOpenAssessment(true);
  };

  const handleCloseAssessment = () => {
    setOpenAssessment(false);
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

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
          يجب تسجيل الدخول لعرض المراحل التعليمية
        </Alert>
      </Box>
    );
  }

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
        title="المراحل التعليمية"
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
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%', px: 3 }}>
            <IconButton
              onClick={() => scrollLevels('left')}
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
              ref={levelsContainerRef}
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
              {levelsData.map(level => (
                <Box key={level.id} sx={{
                  minWidth: { xs: '100%', sm: '80%', md: '45%', lg: '22%' },
                  flexShrink: 0,
                  scrollSnapAlign: 'start'
                }}>
                  <Card
                    sx={{
                      backgroundColor: level.color,
                      minWidth: '350px',
                      color: "#fff",
                      borderRadius: "16px",
                      border: '3px solidrgba(174, 120, 55, 0)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      opacity: level.unlocked ? 1 : 0.7,
                      transition: "0.3s",
                      cursor: level.unlocked ? "pointer" : "default",
                      height: "100%",
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3,
                      ...(level.isAssessment && { '&:hover': { transform: 'scale(1.02)' } })
                    }}
                    onClick={() => handleLevelClick(level.id)}
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
                        minHeight: '150px'
                      }}>
                        {level.icon}
                      </Box>
                      <Box sx={{ textAlign: 'center', width: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{
                          fontFamily: "'Tajawal', sans-serif",
                          mb: 1
                        }}>
                          {level.title}
                        </Typography>
                        <Typography variant="body2" sx={{
                          fontFamily: "'Tajawal', sans-serif"
                        }}>
                          {level.description}
                        </Typography>
                      </Box>
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

        <Assessment
          open={openAssessment}
          onClose={handleCloseAssessment}
          questions={assessmentQuestions}
        />
      </CardContent>
    </Card>
  );
};

export default LearningStages;