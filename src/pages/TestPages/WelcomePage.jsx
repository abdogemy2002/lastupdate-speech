import React from "react";
import "../../style/WelcomePage.css"; 
import WelcomeInit from "../../components/test components/WelcomeInit";

const WelcomePage = () => {
  
    return (
        <div className="welcome-container">
            {/* المحتوى */}
            <div className="welcome-image">
        <img src="src/assets/Vector.png" alt="Welcome" className="imgwelcome" />
      </div>
            <WelcomeInit/>
        </div>
    );
};

export default WelcomePage;
