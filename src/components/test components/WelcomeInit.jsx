import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../context/AuthContext"; // Import the AuthContext hook
import "../../style/WelcomePage.css"; // Ensure styles are being loaded correctly
import { useNavigate } from "react-router-dom";

const WelcomeInit = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Access the user object from AuthContext
  const [showPopup, setShowPopup] = useState(false); // State to control showing the popup

  const handleStartTest = () => {
    // Show the popup
    setShowPopup(true);

    // After the popup shows, navigate to the homepage after a brief delay
    setTimeout(() => {
      navigate("/TestPage");
    }, 2000); // Wait for 2 seconds before navigating
  };

















  
const MicCircle = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isRecording',
})(({ theme, isRecording }) => ({
    backgroundColor: 'white',
    width: '120px',
    aspectRatio: '1 / 1',
    marginLeft: '15px',
    marginBottom: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    flexShrink: 0,
    position: 'relative',
    boxShadow: isRecording
        ? '0 0 0 0 rgba(255, 0, 0, 0.7)'
        : '0 0 0 0 rgba(252, 164, 60, 0.7)',
    animation: isRecording ? 'pulseRed 1.5s infinite' : 'pulse 1.5s infinite',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: isRecording
            ? '0 0 0 10px rgba(255, 0, 0, 0)'
            : '0 0 0 10px rgba(252, 164, 60, 0)',
    },
    '& svg': {
        position: 'relative',
        zIndex: 2,
    },
    '@keyframes pulse': {
        '0%': {
            boxShadow: '0 0 0 0 rgba(252, 164, 60, 0.7)',
        },
        '70%': {
            boxShadow: '0 0 0 15px rgba(252, 164, 60, 0)',
        },
        '100%': {
            boxShadow: '0 0 0 0 rgba(252, 164, 60, 0)',
        },
    },
    '@keyframes pulseRed': {
        '0%': {
            boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.7)',
        },
        '70%': {
            boxShadow: '0 0 0 15px rgba(255, 0, 0, 0)',
        },
        '100%': {
            boxShadow: '0 0 0 0 rgba(255, 0, 0, 0)',
        },
    },
    [theme.breakpoints.down('sm')]: {
        width: '80px',
        height: '80px',
        '@keyframes pulse': {
            '0%': {
                boxShadow: '0 0 0 0 rgba(252, 164, 60, 0.7)',
            },
            '70%': {
                boxShadow: '0 0 0 10px rgba(252, 164, 60, 0)',
            },
            '100%': {
                boxShadow: '0 0 0 0 rgba(252, 164, 60, 0)',
            },
        },
        '@keyframes pulseRed': {
            '0%': {
                boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.7)',
            },
            '70%': {
                boxShadow: '0 0 0 10px rgba(255, 0, 0, 0)',
            },
            '100%': {
                boxShadow: '0 0 0 0 rgba(255, 0, 0, 0)',
            },
        },
    },
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '95%',
    backgroundColor: 'rgb(255, 255, 255)',
    backdropFilter: 'blur(5px)',
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const SeekBar = styled(Slider)(({ theme }) => ({
    color: '#FCA43C',
    height: 4,
    padding: '10px 0',
    '& .MuiSlider-rail': {
        opacity: 0.3,
        backgroundColor: 'rgba(252, 166, 60, 0.49)',
    },
    '& .MuiSlider-track': {
        transition: 'width 0.1s linear',
    },
    '& .MuiSlider-thumb': {
        width: 12,
        height: 12,
        backgroundColor: '#FCA43C',
        boxShadow: 'none',
        transition: 'all 0.1s ease',
        '&:hover, &.Mui-focusVisible': {
            boxShadow: '0 0 0 6px rgba(252, 166, 60, 0.49)',
            width: 14,
            height: 14,
        },
        '&.Mui-active': {
            width: 16,
            height: 16,
        },
    },
}));





























  return (
    <div className="welcome-section">
      {/* Initial Content */}
      <div className="welcome-content">
        <h1 className="welcome-title">مرحبًا بك، {user ? user.displayName : "ضيف"}</h1>
        <p className="welcome-description">
          مرحبًا بكم في منصتنا الرائدة التي تجمع بين الإبداع والتميز! نحن هنا لنكون
          شريككم الأمثل في تحقيق أحلامكم وأهدافكم. نسعى لتقديم تجربة فريدة
          تركز على الجودة.
        </p>
        {/* CTA Button */}
        <Button
          variant="cta-btn"
          className="cta-btn m-2"
          onClick={handleStartTest}
        >
          <span>ابدأ الأختبار</span>
        </Button>
      </div>

      {/* Popup that appears after clicking the button */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>قول ورايا</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeInit;
