import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import TestWelcome from './pages/TestPages/WelcomePage';
import TestPage from './pages/TestPages/TestPage';
import SpeechRecognitionPage from './pages/SpeechRecognitionPage';
import DashboardPage from './pages/patient-dashboard';
import ProfileImageSelectorPage from './pages/ProfileImagePage';
import SelectLetters from './components/Signup Forms/SignUpTestLetters';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  console.log("USER SLICE:", useSelector((state) => state.user));

  useEffect(() => {
    AOS.init();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div>
        <CustomNavbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          {/* الصفحة الرئيسية */}
          <Route path="/" element={<HomePage />} />

          {/* صفحات لا تحتاج مصادقة */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* صفحات تحتاج مصادقة */}
          <Route
            path="/select-profile-image"
            element={isAuthenticated ? <ProfileImageSelectorPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/SelectLetters"
            element={isAuthenticated ? <SelectLetters /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/TestWelcome"
            element={isAuthenticated ? <TestWelcome /> : <Navigate to="/login" />}
          />
          <Route
            path="/TestPage"
            element={isAuthenticated ? <TestPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/speech"
            element={isAuthenticated ? <SpeechRecognitionPage /> : <Navigate to="/login" />}
          />

          {/* Redirect للصفحة الرئيسية إذا كان المسار غير موجود */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
