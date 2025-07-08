import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/userSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import CustomNavbar from './components/CustomNavbar';
import Footer from './components/Footer';
import TestWelcome from './pages/TestPages/InitialTest';
import TestPage from './pages/TestPages/TestPage';
import SpeechRecognitionPage from './pages/SpeechRecognitionPage';
import PatientDashboard from './pages/patient_dashboard';
import ProfileImageSelectorPage from './pages/ProfileImagePage';
import SelectLetters from './components/Signup Forms/SignUpTestLetters';
import UpdateProfile from './pages/PatientProfilePage';
import ChatPage from './components/chat/ChatMain';
import { ChatProvider } from './components/chat/ChatContext'; // استيراد ChatProvider
import DocDetails from './components/SpecialistsList/DocDetails';
import BookingPage from './components/SpecialistsList/BookingPage'; // عدل المسار حسب مكانك
import BookingConfirmation from './components/SpecialistsList/BookingConfirmation'; // عدل المسار حسب مكانك
import LevelDisplay from './components/dashboard/levels/LevelDisplay'; // عدل المسار حسب مكانك
// ✅ هنا بنستخدم useLocation داخل Wrapper علشان نقدر نتحكم في الـ Footer
const AppWrapper = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // 🟢 هنا بنجيب المسار الحالي
  const { isAuthenticated, userType } = useSelector((state) => state.user);

  useEffect(() => {
    AOS.init();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
  };

  // 🟠 المسارات اللي مش عايزين نظهر فيها الفوتر
  const hideFooterPaths = ['/chat'];

  return (
    <ChatProvider>
      <div>
        <CustomNavbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated && userType === 'Patient' ? (
                <Navigate to="/PatientDashboard" />
              ) : (
                <HomePage />
              )
            }
          />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<ChatPage />} />

          <Route
            path="/select-profile-image"
            element={isAuthenticated ? <ProfileImageSelectorPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/SelectLetters"
            element={isAuthenticated ? <SelectLetters /> : <Navigate to="/login" />}
          />
          <Route
            path="/TestPage"
            element={isAuthenticated ? <TestPage /> : <Navigate to="/login" />}
          />
            <Route
            path="/levelDisplay"
            element={isAuthenticated ? <LevelDisplay /> : <Navigate to="/login" />}
          />
          <Route
            path="/UpdateProfile"
            element={isAuthenticated ? <UpdateProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/doctors/:id"
            element={isAuthenticated ? <DocDetails /> : <Navigate to="/login" />}
          />
          <Route
            path="/booking/:id"
            element={isAuthenticated ? <BookingPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/booking-confirmation"
            element={isAuthenticated ? <BookingConfirmation /> : <Navigate to="/login" />}
          />


          <Route
            path="/PatientDashboard/*"
            element={
              isAuthenticated && userType === 'Patient' ? <PatientDashboard /> : <Navigate to="/" />
            }
          />
          <Route
            path="/TestWelcome"
            element={isAuthenticated ? <TestWelcome /> : <Navigate to="/login" />}
          />
          <Route
            path="/speech"
            element={isAuthenticated ? <SpeechRecognitionPage /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* ✅ الشرط هنا: لو مش في صفحة من صفحات الإخفاء، اعرض الفوتر */}
        {!hideFooterPaths.includes(location.pathname) && <Footer />}
      </div>
    </ChatProvider>
  );
};

// نستخدم <AppWrapper /> داخل <Router>
const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
