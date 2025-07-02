import React from 'react';
import { Container, useMediaQuery, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import BackgroundWrapper from '../components/shared/BackgroundWrapper';
import NavigationTabs from '../components/dashboard/DashboardTabs';
import StatsCards from '../components/dashboard/StatsCards';
import LearningStages from '../components/dashboard/LearningStages';
import RecommendedLessons from '../components/dashboard/RecommendedLessons';
import SpecialistsList from '../components/SpecialistsList/SpecialistsList';
import {
  EmojiObjects as EmojiObjectsIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Forum as ForumIcon
} from '@mui/icons-material';

const DashboardPage = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // تحديد ما إذا كنا في مسار الأخصائيين
  const showSpecialists = location.pathname.endsWith('/specialists');

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
      firstName: "محمد",
      lastName: "علي",
      specialty: "أخصائي نطق ولغة",
      rating: 4.8,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      workingDays: ["الإثنين", "الأربعاء", "السبت"],
      availableFrom: "10:00",
      availableTo: "12:00",
      city: "القاهرة",
      nationality: "مصري",
      about: "أخصائي تخاطب مع أكثر من 10 سنوات خبرة في علاج اضطرابات النطق واللغة لدى الأطفال والكبار."
    },
    {
      id: 2,
      firstName: "أحمد",
      lastName: "مصطفى",
      specialty: "استشائي تخاطب",
      rating: 4.6,
      image: "https://randomuser.me/api/portraits/men/44.jpg",
      workingDays: ["الأحد", "الثلاثاء", "الخميس"],
      availableFrom: "09:00",
      availableTo: "11:00",
      city: "الرياض",
      nationality: "سعودي",
      about: "متخصص في علاج التأتأة واضطرابات الطلاقة الكلامية."
    },
    {
      id: 3,
      firstName: "سارة",
      lastName: "عبد الرحمن",
      specialty: "اخصائية نطق أطفال",
      rating: 4.9,
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      workingDays: ["الاثنين", "الأربعاء", "الجمعة"],
      availableFrom: "11:00",
      availableTo: "13:00",
      city: "جدة",
      nationality: "سعودية",
      about: "خبيرة في علاج اضطرابات اللغة عند الأطفال وذوي الاحتياجات الخاصة."
    }
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

  return (
    <BackgroundWrapper>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* التبويبات الثابتة - تظهر دائمًا */}
        <NavigationTabs />
        
        {/* عرض المحتوى حسب المسار */}
        {showSpecialists ? (
          // عرض قائمة الأخصائيين كاملة
          <SpecialistsList doctors={doctors} />
        ) : (
          // عرض لوحة التحكم العادية
          <>
            <StatsCards userData={userData} />
            <LearningStages stages={stages} />
            <RecommendedLessons lessons={recommendedLessons} />
          </>
        )}
      </Container>
    </BackgroundWrapper>
  );
};

export default DashboardPage;