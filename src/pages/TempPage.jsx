import React from 'react';
import SidebarLevels from "../components/SidebarLevels";
import VoiceRecorder from "../components/test components/VoiceRecorder";
import 'bootstrap/dist/css/bootstrap.min.css';

const TempPage = () => {
  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <div className="row flex-grow-1 m-0">
        {/* Sidebar - 4 أعمدة */}
        <div className="col-md-4 p-0">
          <SidebarLevels />
        </div>

        {/* Voice Recorder - مركز الشاشة */}
        <div className="col-md-6 d-flex justify-content-center align-items-end p-0">
          <div
            style={{
              width: '600px', // العرض المناسب
              marginBottom: '40px', // مسافة من تحت
            }}
          >
            <VoiceRecorder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempPage;
