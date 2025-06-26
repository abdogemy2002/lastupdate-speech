import React from 'react';
import SidebarLevels from "../../components/SidebarLevels";
import VoiceRecorder from "../../components/test components/VoiceRecorder";
import "./TestPageStyle.moduel.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const TempPage = () => {
  const phrase = "صباح الفل يا عم اسلام";

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <div className="row flex-grow-1 m-0">
        {/* Sidebar - 4 أعمدة */}
        <div className="col-md-4 p-0">
          <SidebarLevels />
        </div>

        {/* Voice Recorder + الشخصية */}
        <div className="col-md-6 d-flex justify-content-center align-items-end p-0">
          <div className="d-flex flex-column align-items-center mb-4">
            {/* صورة البنت مع ديالوج */}
            <div className="position-relative mb-3">
              <img
                src="../../assets/Vector.png" // 🔁 غير ده لمسار الصورة اللي هتبعتولي
                alt="character"
                style={{ width: '200px' }}
              />
              {/* ديالوج بوكس */}
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#fff',
                  border: '2px solid #ddd',
                  borderRadius: '10px',
                  padding: '10px 15px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  whiteSpace: 'nowrap',
                }}
              >
                {phrase}
              </div>
            </div>

            {/* Voice Recorder */}
            <div style={{ width: '600px' }}>
              <VoiceRecorder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempPage;
