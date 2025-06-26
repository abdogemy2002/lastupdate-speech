import React, { useState, useRef } from 'react';
import '../style/SpeechTest.css'; // Import the CSS file for styling

const SpeechTest = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  // Start recording audio
  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (e) => {
          setAudioBlob(e.data);
          setAudioUrl(URL.createObjectURL(e.data)); // Create audio URL for playback
        };
        mediaRecorderRef.current.start();
      })
      .catch(err => {
        console.error("Error accessing microphone:", err);
      });
  };

  // Stop recording audio
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // Save the audio file (simulated download)
  const saveAudio = () => {
    if (audioBlob) {
      // Create a link to download the audio file
      const audioFile = new Blob([audioBlob], { type: 'audio/wav' });
      const link = document.createElement('a');
      const fileName = `recording_${new Date().toISOString()}.wav`;
      link.href = URL.createObjectURL(audioFile);
      link.download = fileName; // Save the file as .wav
      link.click(); // Simulate the download
    }
  };

  return (
    <div className="speech-test">
      <h3>اختبار النطق الأولي</h3>
      <div className="recording-controls">
        {isRecording ? (
          <button onClick={stopRecording} className="btn-stop">إيقاف التسجيل</button>
        ) : (
          <button onClick={startRecording} className="btn-start">ابدأ التسجيل</button>
        )}
      </div>

      {audioBlob && (
        <div className="audio-player">
          <audio ref={audioRef} controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="submit-controls">
        <button onClick={saveAudio} className="btn-submit">حفظ التسجيل</button>
      </div>
    </div>
  );
};

export default SpeechTest;
