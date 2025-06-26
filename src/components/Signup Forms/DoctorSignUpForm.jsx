import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";

const DoctorSignUp = ({ setActiveForm, setShowForm, handleLogin }) => {
  const [phase, setPhase] = useState(1); // 1 for basic info, 2 for doctor details

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
    <form className="signup-form" onSubmit={formik.handleSubmit}>
      <button type="button" className="back-button" onClick={goBack}>
        <IoArrowBack className="icon" />
      </button>
      <h2>تسجيل الطبيب - {phase === 1 ? "المعلومات الأساسية" : "المعلومات المهنية"}</h2>

      {phase === 1 ? (
        <>
          <div className="mb-3">
            <label className="form-label">
              البريد الإلكتروني:{" "}
              {formik.touched.email && formik.errors.email && (
                <span className="error">({formik.errors.email})</span>
              )}
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="أدخل بريدك الإلكتروني"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              الاسم الأول:{" "}
              {formik.touched.firstName && formik.errors.firstName && (
                <span className="error">({formik.errors.firstName})</span>
              )}
            </label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="أدخل الاسم الأول"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              الاسم الأخير:{" "}
              {formik.touched.lastName && formik.errors.lastName && (
                <span className="error">({formik.errors.lastName})</span>
              )}
            </label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="أدخل الاسم الأخير"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              رقم الهاتف:{" "}
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <span className="error">({formik.errors.phoneNumber})</span>
              )}
            </label>
            <input
              type="text"
              className="form-control"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="أدخل رقم هاتفك (مثال: +201112223344)"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              كلمة المرور:{" "}
              {formik.touched.password && formik.errors.password && (
                <span className="error">({formik.errors.password})</span>
              )}
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="أدخل كلمة المرور"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              تأكيد كلمة المرور:{" "}
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <span className="error">({formik.errors.confirmPassword})</span>
              )}
            </label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="أعد إدخال كلمة المرور"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 form-button">
            التالي
          </button>
        </>
      ) : (
        <>
          <div className="mb-3">
            <label className="form-label">
              تاريخ الميلاد:{" "}
              {formik.touched.birthDate && formik.errors.birthDate && (
                <span className="error">({formik.errors.birthDate})</span>
              )}
            </label>
            <input
              type="date"
              className="form-control"
              name="birthDate"
              value={formik.values.birthDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              الجنسية:{" "}
              {formik.touched.nationality && formik.errors.nationality && (
                <span className="error">({formik.errors.nationality})</span>
              )}
            </label>
            <input
              type="text"
              className="form-control"
              name="nationality"
              value={formik.values.nationality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="أدخل جنسيتك"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              المدينة:{" "}
              {formik.touched.city && formik.errors.city && (
                <span className="error">({formik.errors.city})</span>
              )}
            </label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="أدخل مدينتك"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              الجنس:
            </label>
            <select
              className="form-control"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">
              نبذة عنك:{" "}
              {formik.touched.about && formik.errors.about && (
                <span className="error">({formik.errors.about})</span>
              )}
            </label>
            <textarea
              className="form-control"
              name="about"
              value={formik.values.about}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="أدخل نبذة عنك وتخصصك"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              أيام العمل:{" "}
              {formik.touched.workingDays && formik.errors.workingDays && (
                <span className="error">({formik.errors.workingDays})</span>
              )}
            </label>
            <div className="working-days-container">
              {daysOfWeek.map((day) => (
                <div key={day.value} className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`day-${day.value}`}
                    checked={formik.values.workingDays.includes(day.value)}
                    onChange={() => handleWorkingDayChange(day.value)}
                  />
                  <label className="form-check-label" htmlFor={`day-${day.value}`}>
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">متاح من:</label>
              <input
                type="time"
                className="form-control"
                name="availableFrom"
                value={formik.values.availableFrom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">متاح حتى:</label>
              <input
                type="time"
                className="form-control"
                name="availableTo"
                value={formik.values.availableTo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 form-button">
            تسجيل
          </button>
        </>
      )}
    </form>
  );
};

export default DoctorSignUp;