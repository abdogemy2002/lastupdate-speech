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
