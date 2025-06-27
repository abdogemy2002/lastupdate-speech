import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import styles from "../style/SignUp.module.css"; // تغيير هنا
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

  useEffect(() => {
    if (isAuthenticated) {
      setShowForm(true);
    }
  }, [isAuthenticated]);

  return (
    <div className={styles['signup-page']}>
      <div className={styles['form-container-wrapper']}>
        {/* أزرار اختيار نوع الحساب */}
        {!showForm && (
          <div className={styles['button-container']}>
            <h2 className={styles['dynamic-title']}>حساب جديد</h2>
            <p className={`text-center mt-3 ${styles['center-text']}`}>
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className={styles['login-link']}>
                سجل الدخول الآن
              </Link>
            </p>
            <div className={styles.lines}>
              <div className={`${styles.line} ${styles.thick}`}></div>
              <div className={`${styles.line} ${styles.thick}`}></div>
            </div>
            <div className={`d-flex flex-row gap-4 justify-content-center ${styles['toggle-container']}`}>
              <button
                className={`${styles['toggle-button']} ${styles.patient} ${activeForm === "patient" ? styles['active-strip'] : ""}`}
                onClick={() => handleButtonClick("patient")}
              >
                <img src="src/assets/kids-icon.png" alt="رمز الطفل" />
                تسجيل طفل
              </button>
              <button
                className={`${styles['toggle-button']} ${styles.doctor} ${activeForm === "doctor" ? styles['active-strip'] : ""}`}
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
          <div className={`${styles['form-container']} ${styles.visible}`}>
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
      <img src="src/assets/KHATWTNTK-logo.svg" alt="" className={styles.logoformslide} />
      <ToastContainer />
    </div>
  );
};

export default SignUpPage;