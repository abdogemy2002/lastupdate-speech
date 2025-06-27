import React from 'react';
import VoiceRecorder from "../../components/test components/VoiceRecorder";
import flowerBg from '../../assets/flower-bg.jpg'; // استيراد الصورة مباشرة
import 'bootstrap/dist/css/bootstrap.min.css';

const TempPage = () => {
  return (
    <div style={{ 
      backgroundImage: `url(${flowerBg})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      <div className="container-fluid h-100 d-flex flex-column p-0">
        <VoiceRecorder />
      </div>
    </div>
  );
};

export default TempPage;