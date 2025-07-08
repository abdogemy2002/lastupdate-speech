import React from 'react';
import VoiceRecorder from "../../components/test components/VoiceRecorder";
import flowerBg from '../../assets/flower-bg.jpg'; 
import DashboardTabs from '../../components/dashboard/DashboardTabs';
import { Dashboard } from '@mui/icons-material';

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
        {/* <DashboardTabs /> */}
        <VoiceRecorder />
      </div>
    </div>
  );
};

export default TempPage;