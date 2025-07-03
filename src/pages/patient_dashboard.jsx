import React, { useState, useEffect } from 'react';
import { Container, useMediaQuery, useTheme, CircularProgress, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import BackgroundWrapper from '../components/shared/BackgroundWrapper';
import NavigationTabs from '../components/dashboard/DashboardTabs';
import StatsCards from '../components/dashboard/StatsCards';
import LearningStages from '../components/dashboard/LearningStages';
import RecommendedLessons from '../components/dashboard/RecommendedLessons';
import SpecialistsList from '../components/SpecialistsList/SpecialistsList';
import DoctorsCarousel from '../components/dashboard/DoctorsCarousel';
import {
  EmojiObjects as EmojiObjectsIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Forum as ForumIcon
} from '@mui/icons-material';

const DashboardPage = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://speech-correction-api.azurewebsites.net/api/Doctor/get-all-doctors');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        
        const transformedDoctors = result.data.map(doctor => ({
          id: doctor.id || Math.random().toString(36).substr(2, 9),
          name: `${doctor.firstName || 'دكتور'} ${doctor.lastName || ''}`.trim(),
          specialty: 'أخصائي تخاطب',
          image: doctor.profilePictureUrl || '/default-doctor-avatar.png',
          rating: doctor.rating || 0,
          availableSlots: doctor.workingDays && doctor.workingDays.length > 0 
            ? doctor.workingDays 
            : ['لا يوجد مواعيد متاحة'],
          about: doctor.about || 'لا يوجد معلومات إضافية',
          workingHours: doctor.availableFrom && doctor.availableTo 
            ? `${doctor.availableFrom} - ${doctor.availableTo}`
            : 'غير محدد',
          city: doctor.city || null
        }));

        setDoctors(transformedDoctors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const userData = {
    name: "أحمد محمد",
    level: "متوسط",
    points: 750,
    nextLevelPoints: 250,
    progress: 65,
    completedLessons: 18,
    streak: 5
  };

  const stages = [
    { id: 1, title: "الكلمات", description: "تحسين نطق الكلمات الفردية", icon: <EmojiObjectsIcon fontSize="large" />, completed: true },
    { id: 2, title: "جمل بسيطة", description: "نطق جمل قصيرة وبسيطة", icon: <RecordVoiceOverIcon fontSize="large" />, completed: true, current: true },
    { id: 3, title: "جمل صعبة", description: "نطق جمل طويلة ومعقدة", icon: <ForumIcon fontSize="large" />, completed: false }
  ];

  const recommendedLessons = [
    {
      title: "الحروف المفخمة",
      description: "تعلم نطق الحروف المفخمة بشكل صحيح مع تمارين تفاعلية.",
      image: "/img/pronunciation1.jpg"
    },
    {
      title: "الحروف المنخفضة",
      description: "إتقان نطق الحروف المنخفضة بتمارين عملية.",
      image: "/img/pronunciation2.jpg"
    },
    {
      title: "الجمل الطويلة",
      description: "تحسين نطق الجمل الطويلة والمعقدة.",
      image: "/img/pronunciation3.jpg"
    }
  ];

  if (loading) {
    return (
      <BackgroundWrapper>
        <Container maxWidth="lg" sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '70vh'
        }}>
          <CircularProgress size={60} />
        </Container>
      </BackgroundWrapper>
    );
  }

  if (error) {
    return (
      <BackgroundWrapper>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">
            فشل في تحميل البيانات: {error}
          </Alert>
        </Container>
      </BackgroundWrapper>
    );
  }

  const showSpecialists = location.pathname.endsWith('/specialists');

  return (
    <BackgroundWrapper>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 0 }}>
        <NavigationTabs />

        {showSpecialists ? (
          <SpecialistsList doctors={doctors} />
        ) : (
          <>
            <StatsCards userData={userData} />
            <LearningStages stages={stages} />
            <DoctorsCarousel doctors={doctors} />
            <RecommendedLessons lessons={recommendedLessons} />
          </>
        )}
      </Container>
    </BackgroundWrapper>
  );
};

export default DashboardPage;