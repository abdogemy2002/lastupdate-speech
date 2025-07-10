import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/userSlice";
import "react-toastify/dist/ReactToastify.css";
import styles from "../style/SignUp.module.css"; // استيراد ملف CSS Module

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("البريد الإلكتروني غير صالح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف")
      .required("كلمة المرور مطلوبة"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          "https://speech-correction-api.azurewebsites.net/api/Account/login",
          {
            email: values.email,
            password: values.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { id,email, firstName, lastName, userType, profilePictureUrl, token } = response.data;

        const userPayload = {
          id,
          token,
          email,
          firstName,
          lastName,
          userType,
          profileImageUrl: profilePictureUrl,
          isAuthenticated: true
        };

        dispatch(loginSuccess(userPayload));
        toast.success("تم تسجيل الدخول بنجاح!");
        console.log("User data:", userPayload);

        if (userType === "Patient") {
          navigate("/PatientDashboard");
        } else if (userType === "Doctor") {
          navigate("/DoctorDashboard");
        }
      } catch (error) {
        let errorMessage = "فشل تسجيل الدخول";
        console.error("Login error:", error);
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
          } else if (error.response.status === 400) {
            errorMessage = "بيانات الاعتماد غير صالحة";
          } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className={styles['signup-page']}>
      <div className={styles['form-container-wrapper']}>
        <div className={styles['button-container']}>
          <h2 className={styles['dynamic-title']}>تسجيل الدخول</h2>

          <p className={styles['existing-account-text']}>
            ليس لديك حساب؟{" "}
            <Link to="/signup" className={styles['login-link']}>
              أنشئ حساب جديد
            </Link>
          </p>

          <div className={styles.lines}>
            <div className={`${styles.line} ${styles.thick}`}></div>
            <div className={`${styles.line} ${styles.thick}`}></div>
          </div>

          <form onSubmit={formik.handleSubmit} className={styles['signup-form']}>
            <div className={`mb-3 ${styles['form-group']}`}>
              <label htmlFor="email" className={styles['form-label']}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`${styles['form-control']} ${formik.touched.email && formik.errors.email ? styles['is-invalid'] : ""
                  }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                disabled={isSubmitting}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className={styles['invalid-feedback']}>{formik.errors.email}</div>
              ) : null}
            </div>

            <div className={`mb-3 ${styles['form-group']}`}>
              <label htmlFor="password" className={styles['form-label']}>
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`${styles['form-control']} ${formik.touched.password && formik.errors.password ? styles['is-invalid'] : ""
                  }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                disabled={isSubmitting}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className={styles['invalid-feedback']}>{formik.errors.password}</div>
              ) : null}
            </div>

            <button
              type="submit"
              className={`${styles.btn} ${styles['btn-primary']} w-100`}
              disabled={isSubmitting || !formik.isValid}
            >
              {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>

            <div className={`text-center mt-3 ${styles['text-center']}`}>
              <Link to="/forgot-password" className={styles['login-link']}>
                نسيت كلمة المرور؟
              </Link>
            </div>
          </form>
        </div>
      </div>

      <img
        src="src/assets/KHATWTNTK-logo.svg"
        alt=""
        className={styles.logoformslide}
      />
      <ToastContainer />
    </div>
  );
};

export default LoginPage;