import React, { useState, useEffect } from 'react';
import "../style/spee.css";
import { FaMicrophone } from 'react-icons/fa';
import vectorImage from "../assets/Vector.png";
import mobileImage from "../assets/Vector.png";
// import VoiceRecorder from "./components/VoiceRecorder.jsx";


const SpeechRecognitionPage = () => {
  const [imageSrc, setImageSrc] = useState(vectorImage);

  useEffect(() => {
    const updateImage = () => {
      if (window.innerWidth <= 480) {
        setImageSrc(mobileImage);
      } else {
        setImageSrc(vectorImage);
      }
    };

    updateImage(); // تحديث الصورة عند تحميل الصفحة
    window.addEventListener("resize", updateImage);

    return () => window.removeEventListener("resize", updateImage);
  }, []);

  return (
    <div className="speech-page">
      <div className="speech-content">
        <img src={imageSrc} alt="Character" className="character-img" />
        <div className="speech-bubble">
          <p className="speech-text">الحرف</p>
        </div>
      </div>
      <button className="mic-button">
        <FaMicrophone size={40} />
      </button>
    </div>
  );
};

export default SpeechRecognitionPage;