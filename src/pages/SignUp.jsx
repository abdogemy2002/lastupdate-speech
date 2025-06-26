import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../style/SignUp.css";
import PatientSignUp from "../components/Signup Forms/PatientSignUpForm";
import DoctorSignUp from "../components/Signup Forms/DoctorSignUpForm";
import { loginSuccess } from "../store/slices/userSlice";

const SignUpPage = () => {
  const [activeForm, setActiveForm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleButtonClick = (formType) => {
    setActiveForm(formType);
    setShowForm(true);
  };

  const handleLogin = (userData) => {
    const { token, email, firstName, lastName, userType } = userData;
    dispatch(loginSuccess({ token, email, firstName, lastName, userType }));
    localStorage.setItem("user", JSON.stringify({ token, email, firstName, lastName, userType }));
    toast.success("تم تسجيل الحساب بنجاح!");
  };

  // منع السكروول لما الفورم مش ظهرة
  useEffect(() => {
    document.body.style.overflow = showForm ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showForm]);

  // إظهار الفورم تلقائيًا لو المستخدم بالفعل مسجل دخول
  useEffect(() => {
    if (isAuthenticated) {
      setShowForm(true);
    }
  }, [isAuthenticated]);

  return (
    <div className="signup-page">
      <div className="form-container-wrapper">
        {/* أزرار اختيار نوع الحساب */}
        {!showForm && (
          <div className="button-container">
            <h2 className="dynamic-title">حساب جديد</h2>
            <p className="text-center mt-3">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="login-link">
                سجل الدخول الآن
              </Link>
            </p>
            <div className="lines">
              <div className="line thick"></div>
              <div className="line thick"></div>
            </div>
            <div className="toggle-container d-flex flex-row gap-4 justify-content-center">
              <button
                className={`toggle-button patient ${activeForm === "patient" ? "active-strip" : ""}`}
                onClick={() => handleButtonClick("patient")}
              >
                <img src="src/assets/kids-icon.png" alt="رمز الطفل" />
                تسجيل طفل
              </button>
              <button
                className={`toggle-button doctor ${activeForm === "doctor" ? "active-strip" : ""}`}
                onClick={() => handleButtonClick("doctor")}
              >
                <img src="src/assets/doctor-icon.png" alt="رمز الطبيب" />
                تسجيل طبيب
              </button>
            </div>
          </div>
        )}

        {/* الفورم بعد اختيار النوع */}
        {showForm && (
          <div className="form-container visible">
            {activeForm === "patient" && (
              <PatientSignUp
                setActiveForm={setActiveForm}
                setShowForm={setShowForm}
                handleLogin={handleLogin}
              />
            )}
            {activeForm === "doctor" && (
              <DoctorSignUp
                setActiveForm={setActiveForm}
                setShowForm={setShowForm}
                handleLogin={handleLogin}
              />
            )}
          </div>
        )}
      </div>

      {/* اللوجو والتنبيهات */}
      <img src="src/assets/KHATWTNTK-logo.svg" alt="" className="logoformslide" />
      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
