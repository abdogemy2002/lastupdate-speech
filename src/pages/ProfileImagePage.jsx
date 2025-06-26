// src/pages/ProfileImagePage.jsx

import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "../style/SignUp.css";
import ProfileImageSelector from "../components/Signup Forms/ProfileImageSelector";

const ProfileImagePage = () => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleAvatarSelect = (url) => {
    console.log("✅ تم اختيار أفاتار:", url);
    setAvatarUrl(url);
  };

  const handleImageUpload = (file) => {
    console.log("✅ تم رفع صورة:", file);
    setUploadedFile(file);
  };

  return (
    <div className="signup-page">
      <div className="form-container-wrapper">
        <div className="form-container visible">
          <ProfileImageSelector
            onAvatarSelect={handleAvatarSelect}
            onImageUpload={handleImageUpload}
          />
        </div>
      </div>
      <img src="src/assets/KHATWTNTK-logo.svg" alt="" className="logoformslide" />
      <ToastContainer />
    </div>
  );
};

export default ProfileImagePage;
