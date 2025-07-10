import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/userSlice";
import styles from "../../style/SignUp.module.css";
const DoctorSignUp = ({ setActiveForm, setShowForm, handleLogin }) => {
  const [phase, setPhase] = useState(1); // 1 for basic info, 2 for doctor details
const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      // Phase 1 fields
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",

      // Phase 2 fields
      birthDate: "",
      nationality: "",
      city: "",
      gender: "male",
      userType: "Doctor",
      about: "",
      workingDays: [],
      availableFrom: "09:00",
      availableTo: "15:00"
    },
    validationSchema: Yup.object({
      // Phase 1 validation
      email: Yup.string()
        .email("البريد الإلكتروني غير صالح")
        .required("البريد الإلكتروني مطلوب"),
      firstName: Yup.string().required("الاسم الأول مطلوب"),
      lastName: Yup.string().required("الاسم الأخير مطلوب"),
      phoneNumber: Yup.string()
        .matches(/^\+?\d{10,15}$/, "رقم الهاتف غير صالح")
        .required("رقم الهاتف مطلوب"),
      password: Yup.string()
        .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          "يجب أن تحتوي كلمة المرور على حرف واحد ورقم ورمز خاص على الأقل"
        )
        .required("كلمة المرور مطلوبة"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'كلمات المرور غير متطابقة')
        .required('تأكيد كلمة المرور مطلوب'),

      // Phase 2 validation
      birthDate: Yup.string().when('phase', {
        is: 2,
        then: Yup.string().required("تاريخ الميلاد مطلوب")
      }),
      nationality: Yup.string().when('phase', {
        is: 2,
        then: Yup.string().required("الجنسية مطلوبة")
      }),
      city: Yup.string().when('phase', {
        is: 2,
        then: Yup.string().required("المدينة مطلوبة")
      }),
      about: Yup.string().when('phase', {
        is: 2,
        then: Yup.string().required("نبذة عنك مطلوبة")
      }),
      workingDays: Yup.array().when('phase', {
        is: 2,
        then: Yup.array()
          .min(1, "يجب اختيار يوم عمل واحد على الأقل")
          .required("أيام العمل مطلوبة")
      }),
    }),
    onSubmit: (values) => {
      if (phase === 1) {
        setPhase(2);
        return;
      }

      const requestData = {
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        firstName: values.firstName,
        lastName: values.lastName,
        birthDate: values.birthDate,
        nationality: values.nationality,
        city: values.city,
        gender: values.gender,
        userType: values.userType,
        patient: null,
        doctor: {
          about: values.about,
          workingDays: values.workingDays,
          availableFrom: values.availableFrom,
          availableTo: values.availableTo
        }
      };

      axios
        .post("https://speech-correction-api.azurewebsites.net/api/Account/register", requestData)
        .then((response) => {
          handleLogin(response.data);
          toast.success("تم التسجيل بنجاح كطبيب!");
          navigate("/Doc-profile-image");
        })
        .catch((error) => {
          console.error("Registration error:", error);
          toast.error("حدث خطأ أثناء التسجيل!");
        });
    },
  });

  const goBack = () => {
    if (phase === 1) {
      setActiveForm(""); // Clear active form
      setShowForm(false); // Hide the form
    } else {
      setPhase(1); // Go back to previous phase
    }
  };

  const handleWorkingDayChange = (day) => {
    const currentDays = [...formik.values.workingDays];
    if (currentDays.includes(day)) {
      const index = currentDays.indexOf(day);
      currentDays.splice(index, 1);
    } else {
      currentDays.push(day);
    }
    formik.setFieldValue("workingDays", currentDays);
  };

  const daysOfWeek = [
    { value: "Sunday", label: "الأحد" },
    { value: "Monday", label: "الإثنين" },
    { value: "Tuesday", label: "الثلاثاء" },
    { value: "Wednesday", label: "الأربعاء" },
    { value: "Thursday", label: "الخميس" },
    { value: "Friday", label: "الجمعة" },
    { value: "Saturday", label: "السبت" },
  ];


  return (
    <form className={styles["signup-form"]} onSubmit={formik.handleSubmit}>
      <button
        className={styles["back-button"]}
        onClick={goBack}
        type="button"
      >
        <IoArrowBack className={styles.icon} />
      </button>

      <h2>تسجيل الطبيب - {phase === 1 ? "المعلومات الأساسية" : "المعلومات المهنية"}</h2>

      <div className={styles["form-fields-container"]}>
        {phase === 1 ? (
          <>
            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                البريد الإلكتروني:{" "}
                {formik.touched.email && formik.errors.email && (
                  <span className={styles.error}>({formik.errors.email})</span>
                )}
              </label>
              <input
                type="email"
                className={styles["form-control"]}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                الاسم الأول:{" "}
                {formik.touched.firstName && formik.errors.firstName && (
                  <span className={styles.error}>({formik.errors.firstName})</span>
                )}
              </label>
              <input
                type="text"
                className={styles["form-control"]}
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل الاسم الأول"
              />
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                الاسم الأخير:{" "}
                {formik.touched.lastName && formik.errors.lastName && (
                  <span className={styles.error}>({formik.errors.lastName})</span>
                )}
              </label>
              <input
                type="text"
                className={styles["form-control"]}
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل الاسم الأخير"
              />
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                رقم الهاتف:{" "}
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <span className={styles.error}>({formik.errors.phoneNumber})</span>
                )}
              </label>
              <input
                type="text"
                className={styles["form-control"]}
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل رقم هاتفك (مثال: +201112223344)"
              />
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                كلمة المرور:{" "}
                {formik.touched.password && formik.errors.password && (
                  <span className={styles.error}>({formik.errors.password})</span>
                )}
              </label>
              <input
                type="password"
                className={styles["form-control"]}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل كلمة المرور"
              />
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                تأكيد كلمة المرور:{" "}
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <span className={styles.error}>({formik.errors.confirmPassword})</span>
                )}
              </label>
              <input
                type="password"
                className={styles["form-control"]}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أعد إدخال كلمة المرور"
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                تاريخ الميلاد:{" "}
                {formik.touched.birthDate && formik.errors.birthDate && (
                  <span className={styles.error}>({formik.errors.birthDate})</span>
                )}
              </label>
              <input
                type="date"
                className={styles["form-control"]}
                name="birthDate"
                value={formik.values.birthDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                الجنسية:{" "}
                {formik.touched.nationality && formik.errors.nationality && (
                  <span className={styles.error}>({formik.errors.nationality})</span>
                )}
              </label>
              <select
                className={styles["form-control"]}
                name="nationality"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="Egyptian">مصري</option>
                <option value="Saudi">سعودي</option>
                <option value="Emirati">إماراتي</option>
                <option value="Other">أخرى</option>
              </select>
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                المدينة:{" "}
                {formik.touched.city && formik.errors.city && (
                  <span className={styles.error}>({formik.errors.city})</span>
                )}
              </label>
              <input
                type="text"
                className={styles["form-control"]}
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل المدينة"
              />
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                الجنس:
              </label>
              <select
                className={styles["form-control"]}
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                نبذة عنك:{" "}
                {formik.touched.about && formik.errors.about && (
                  <span className={styles.error}>({formik.errors.about})</span>
                )}
              </label>
              <textarea
                className={styles["form-control"]}
                name="about"
                value={formik.values.about}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل نبذة عنك وتخصصك"
                rows="4"
              />
            </div>
            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                أيام العمل:{" "}
                {formik.touched.workingDays && formik.errors.workingDays && (
                  <span className={styles.error}>({formik.errors.workingDays})</span>
                )}
              </label>

              <div className={styles["working-days-grid"]}>
                {daysOfWeek.map((day) => (
                  <div key={day.value} className={styles["day-item"]}>
                    <input
                      type="checkbox"
                      id={`day-${day.value}`}
                      checked={formik.values.workingDays.includes(day.value)}
                      onChange={() => handleWorkingDayChange(day.value)}
                      className={styles["day-checkbox"]}
                    />
                    <label
                      htmlFor={`day-${day.value}`}
                      className={`${styles["day-label"]} ${formik.values.workingDays.includes(day.value) ? styles["selected"] : ""
                        }`}
                    >
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles["time-selection"]}>
              <div className={styles["time-input"]}>
                <label className={styles["form-label"]}>متاح من:</label>
                <input
                  type="time"
                  className={styles["form-control"]}
                  name="availableFrom"
                  value={formik.values.availableFrom}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className={styles["time-input"]}>
                <label className={styles["form-label"]}>متاح حتى:</label>
                <input
                  type="time"
                  className={styles["form-control"]}
                  name="availableTo"
                  value={formik.values.availableTo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        {phase === 1 ? (
          <button
            type="button"
            style={{
              borderRadius: '15px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              padding: '0.75rem',
              width: '100%',
              backgroundColor: '#20B2AA',
              color: 'white',
              border: '2px solid #20B2AA'
            }}
            onClick={formik.handleSubmit}
          >
            التالي
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              style={{
                flex: 1,
                borderRadius: '15px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                padding: '0.75rem',
                backgroundColor: 'white',
                color: '#20B2AA',
                border: '2px solid #20B2AA'
              }}
              onClick={() => setPhase(1)}
            >
              السابق
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                borderRadius: '15px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                padding: '0.75rem',
                backgroundColor: '#FCA43C',
                color: 'white',
                border: '2px solid #FCA43C'
              }}
            >
              تسجيل
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default DoctorSignUp;