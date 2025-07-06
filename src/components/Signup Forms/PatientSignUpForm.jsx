import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/userSlice";
import styles from "../../style/SignUp.module.css";

const PatientSignUpForm = ({ setActiveForm, setShowForm, handleLogin, setShowProfileSelector }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      nationality: "Egyptian",
      city: "",
      gender: "male",
      userType: "Patient",
      familyMembersCount: "",
      siblingRank: "",
      latestIqTestResult: "",
      latestRightEarTestResult: "",
      latestLeftEarTestResult: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("البريد الإلكتروني غير صالح")
        .required("البريد الإلكتروني مطلوب"),
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
      phoneNumber: Yup.string()
        .matches(/^\+?\d{10,15}$/, "رقم الهاتف غير صالح")
        .required("رقم الهاتف مطلوب"),
      firstName: Yup.string().required("الاسم الأول مطلوب"),
      lastName: Yup.string().required("الاسم الأخير مطلوب"),
      birthDate: Yup.date()
        .required("تاريخ الميلاد مطلوب")
        .max(new Date(), "تاريخ الميلاد لا يمكن أن يكون في المستقبل"),
      nationality: Yup.string().required("الجنسية مطلوبة"),
      city: Yup.string().required("المدينة مطلوبة"),
      gender: Yup.string().required("الجنس مطلوب"),
      familyMembersCount: Yup.number()
        .min(1, "يجب أن يكون عدد أفراد الأسرة على الأقل 1")
        .required("عدد أفراد الأسرة مطلوب"),
      siblingRank: Yup.number()
        .min(1, "يجب أن يكون ترتيب الطفل بين إخوته على الأقل 1")
        .required("ترتيب الطفل بين إخوته مطلوب"),
      latestIqTestResult: Yup.number()
        .min(0, "لا يمكن أن تكون نتيجة اختبار الذكاء سالبة")
        .max(200, "نتيجة اختبار الذكاء غير واقعية")
        .nullable(),
      latestRightEarTestResult: Yup.number()
        .min(0, "لا يمكن أن تكون نتيجة اختبار الأذن اليمنى سالبة")
        .max(100, "نتيجة اختبار الأذن اليمنى غير واقعية")
        .nullable(),
      latestLeftEarTestResult: Yup.number()
        .min(0, "لا يمكن أن تكون نتيجة اختبار الأذن اليسرى سالبة")
        .max(100, "نتيجة اختبار الأذن اليسرى غير واقعية")
        .nullable(),
    }),
    onSubmit: (values) => {
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
        patient: {
          familyMembersCount: parseInt(values.familyMembersCount),
          siblingRank: parseInt(values.siblingRank),
          latestIqTestResult: values.latestIqTestResult ? parseFloat(values.latestIqTestResult) : null,
          latestRightEarTestResult: values.latestRightEarTestResult ? parseFloat(values.latestRightEarTestResult) : null,
          latestLeftEarTestResult: values.latestLeftEarTestResult ? parseFloat(values.latestLeftEarTestResult) : null
        }
      };

      axios.post("https://speech-correction-api.azurewebsites.net/api/Account/register", requestData)
        .then((response) => {
          // أضفنا id هنا
          const userData = {
            id: response.data.id, // إضافة حقل id
            token: response.data.token,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            userType: response.data.userType,
            profilePictureUrl: response.data.profilePictureUrl || null, // تأكد من تطابق الأسماء
            isAuthenticated: true,
          };
          dispatch(loginSuccess(userData));

          localStorage.setItem("isNewUser", "true");

          toast.success("تم تسجيل الطفل بنجاح!");
          navigate("/select-profile-image");
        })
        .catch((error) => {
          console.error("Registration error:", error);
          toast.error("حدث خطأ أثناء التسجيل!");
        });
    },
  });

  const goBack = (e) => {
    e.preventDefault();
    if (step === 1) {
      setActiveForm("");
      setShowForm(false);
    } else {
      setStep(step - 1);
    }
  };

  const nextStep = () => {
    const currentFields = step === 1 ?
      ['email', 'password', 'confirmPassword', 'phoneNumber', 'firstName', 'lastName', 'birthDate'] :
      ['nationality', 'city', 'gender', 'familyMembersCount', 'siblingRank'];

    const isValid = currentFields.every(field => !formik.errors[field]);

    if (isValid) {
      setStep(step + 1);
    } else {
      currentFields.forEach(field => {
        if (formik.errors[field]) {
          toast.error(formik.errors[field]);
        }
      });
    }
  };

  return (
    <form className={styles["signup-form"]} onSubmit={formik.handleSubmit}>
      <button
        className={styles["back-button"]}
        onClick={goBack}
        type="button"
      >
        <IoArrowBack className={styles.icon} />
      </button>

      <h2>تسجيل الطفل</h2>

      <div className={styles["form-fields-container"]}>
        {step === 1 ? (
          <>
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
          </>
        ) : (
          <>
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
                الجنس:{" "}
                {formik.touched.gender && formik.errors.gender && (
                  <span className={styles.error}>({formik.errors.gender})</span>
                )}
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
                عدد أفراد الأسرة:{" "}
                {formik.touched.familyMembersCount && formik.errors.familyMembersCount && (
                  <span className={styles.error}>({formik.errors.familyMembersCount})</span>
                )}
              </label>
              <input
                type="number"
                min="1"
                className={styles["form-control"]}
                name="familyMembersCount"
                value={formik.values.familyMembersCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل عدد أفراد الأسرة"
              />
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                ترتيب الطفل بين إخوته:{" "}
                {formik.touched.siblingRank && formik.errors.siblingRank && (
                  <span className={styles.error}>({formik.errors.siblingRank})</span>
                )}
              </label>
              <input
                type="number"
                min="1"
                className={styles["form-control"]}
                name="siblingRank"
                value={formik.values.siblingRank}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل ترتيب الطفل بين إخوته"
              />
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                نتيجة اختبار الذكاء (اختياري):{" "}
                {formik.touched.latestIqTestResult && formik.errors.latestIqTestResult && (
                  <span className={styles.error}>({formik.errors.latestIqTestResult})</span>
                )}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="200"
                className={styles["form-control"]}
                name="latestIqTestResult"
                value={formik.values.latestIqTestResult}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل نتيجة اختبار الذكاء (اختياري)"
              />
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                نتيجة اختبار الأذن اليمنى (اختياري):{" "}
                {formik.touched.latestRightEarTestResult && formik.errors.latestRightEarTestResult && (
                  <span className={styles.error}>({formik.errors.latestRightEarTestResult})</span>
                )}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                className={styles["form-control"]}
                name="latestRightEarTestResult"
                value={formik.values.latestRightEarTestResult}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل نتيجة اختبار الأذن اليمنى (اختياري)"
              />
            </div>

            <div className={styles["mb-3"]}>
              <label className={styles["form-label"]}>
                نتيجة اختبار الأذن اليسرى (اختياري):{" "}
                {formik.touched.latestLeftEarTestResult && formik.errors.latestLeftEarTestResult && (
                  <span className={styles.error}>({formik.errors.latestLeftEarTestResult})</span>
                )}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                className={styles["form-control"]}
                name="latestLeftEarTestResult"
                value={formik.values.latestLeftEarTestResult}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="أدخل نتيجة اختبار الأذن اليسرى (اختياري)"
              />
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        {step === 1 ? (
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
            onClick={nextStep}
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
              onClick={() => setStep(1)}
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

export default PatientSignUpForm;