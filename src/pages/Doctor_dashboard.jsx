import React from 'react';
import { Container } from '@mui/material';
import BackgroundWrapper from '../components/shared/BackgroundWrapper';
import UserHeader from '../components/dashboard/UserHeader';
import StatsCards from '../components/dashboard/StatsCards';
import LearningStages from '../components/dashboard/LearningStages';
import DoctorsCarousel from '../components/dashboard/DoctorsCarousel';
import RecommendedLessons from '../components/dashboard/RecommendedLessons';
import { 
  EmojiObjects as EmojiObjectsIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Forum as ForumIcon 
} from '@mui/icons-material';

const DashboardPage = () => {
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
    // ... دروس أخرى
  ];

  return (
    <BackgroundWrapper>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        <UserHeader userData={userData} />
        <StatsCards userData={userData} />
        <LearningStages stages={stages} />
        <DoctorsCarousel doctors={doctors} />
        <RecommendedLessons lessons={recommendedLessons} />
      </Container>
    </BackgroundWrapper>
  );
};

export default DashboardPage;