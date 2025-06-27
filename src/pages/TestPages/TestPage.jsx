import React from 'react';
import SidebarLevels from "../../components/SidebarLevels";
import VoiceRecorder from "../../components/test components/VoiceRecorder";
import "./TestPageStyle.moduel.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const TempPage = () => {
  const phrase = "صباح الفل يا عم اسلام";

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
                 <VoiceRecorder />

    </div>
  );
};

export default TempPage;
