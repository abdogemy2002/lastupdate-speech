import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import styles from "../style/SignUp.module.css"; // استيراد ملف CSS Module
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
    <div className={styles['signup-page']}>
      <div className={styles['form-container-wrapper']}>
        <div className={`${styles['form-container']} ${styles.visible}`}>
          <ProfileImageSelector
            onAvatarSelect={handleAvatarSelect}
            onImageUpload={handleImageUpload}
          />
        </div>
      </div>
      <img 
        src="src/assets/KHATWTNTK-logo.svg" 
        alt="" 
        className={styles.logoformslide} 
      />
      <ToastContainer />
    </div>
  );
};

export default ProfileImagePage;