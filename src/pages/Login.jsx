import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/userSlice"; // استيراد action تسجيل الدخول من Redux
import "react-toastify/dist/ReactToastify.css";
import "../style/SignUp.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // استخدام useDispatch بدلاً من useAuth
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("البريد الإلكتروني غير صالح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف")
      .required("كلمة المرور مطلوبة"),
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // API call to authenticate user
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

        const { email, firstName, lastName, userType, profilePictureUrl, token } = response.data;


        const userPayload = {
          token,
          email,
          firstName,
          lastName,
          userType,
          profileImageUrl: profilePictureUrl,
          isAuthenticated: true
        };

        // Dispatch to redux
        dispatch(loginSuccess(userPayload));


        toast.success("تم تسجيل الدخول بنجاح!");

        // Redirect based on user type
        if (userType === "Patient") {
          navigate("/patient-dashboard");
        } else if (userType === "Therapist") {
          navigate("/therapist-dashboard");
        }
      } catch (error) {
        let errorMessage = "فشل تسجيل الدخول";
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
    <div className="signup-page">
      <div className="form-container-wrapper">
        <div className="button-container">
          <h2 className="dynamic-title">تسجيل الدخول</h2>

          <p className="existing-account-text">
            ليس لديك حساب؟{" "}
            <Link to="/signup" className="login-link">
              أنشئ حساب جديد
            </Link>
          </p>

          <div className="lines">
            <div className="line thick"></div>
            <div className="line thick"></div>
          </div>
          <form onSubmit={formik.handleSubmit} className="signup-form">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""
                  }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                disabled={isSubmitting}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="invalid-feedback">{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
                  }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                disabled={isSubmitting}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="invalid-feedback">{formik.errors.password}</div>
              ) : null}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting || !formik.isValid}
            >
              {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>

            <div className="text-center mt-3">
              <Link to="/forgot-password" className="login-link">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </form>
        </div>
      </div>

      <img src="src/assets/KHATWTNTK-logo.svg" alt="" className="logoformslide" />
      <ToastContainer />
    </div>
  );
};

export default LoginPage;