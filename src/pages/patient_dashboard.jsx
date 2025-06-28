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

const doctors = [
  { 
    id: 1, 
    name: "د. محمد علي", 
    specialty: "أخصائي نطق ولغة", 
    rating: 4.8, 
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    availableSlots: ["الإثنين 10 ص", "الأربعاء 2 م", "السبت 11 ص"]
  },
  { 
    id: 2, 
    name: "د. أحمد مصطفى", 
    specialty: "استشائي تخاطب", 
    rating: 4.6, 
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    availableSlots: ["الأحد 9 ص", "الثلاثاء 3 م", "الخميس 1 م"]
  },
  { 
    id: 3, 
    name: "د. سارة عبد الرحمن", 
    specialty: "اخصائية نطق أطفال", 
    rating: 4.9, 
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    availableSlots: ["الاثنين 11 ص", "الأربعاء 10 ص", "الجمعة 4 م"]
  },
  { 
    id: 4, 
    name: "د. خالد سعيد", 
    specialty: "استشائي لغة وتواصل", 
    rating: 4.7, 
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    availableSlots: ["السبت 9 ص", "الاحد 2 م", "الثلاثاء 5 م"]
  },
  { 
    id: 5, 
    name: "د. نورا محمد", 
    specialty: "اخصائية تأهيل نطق", 
    rating: 4.5, 
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    availableSlots: ["الخميس 8 ص", "الجمعة 11 ص", "الاحد 4 م"]
  }
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