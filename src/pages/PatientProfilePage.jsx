import React, { useEffect, useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../store/slices/userSlice";
import {
  Container, Typography, TextField, Select, MenuItem, FormControl,
  InputLabel, Button, Paper, Grid, Divider, Avatar,
  IconButton, CircularProgress, Box, Modal
} from "@mui/material";
import { ArrowBack, Save, Edit } from "@mui/icons-material";
import BackgroundWrapper from "../components/shared/BackgroundWrapper";
import EditProfileImage from "../components/Signup Forms/ProfileImageSelector";

// تعريف مكون الحقل النصي بشكل منفصل لمنع إعادة التصيير غير الضرورية
const CustomTextField = React.memo(({ name, label, type = "text", disabled = false, formik, ...props }) => {
  const [localValue, setLocalValue] = useState(formik.values[name]);

  useEffect(() => {
    setLocalValue(formik.values[name]);
  }, [formik.values[name]]);

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      disabled={disabled}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={(e) => {
        formik.handleBlur(e);
        formik.setFieldValue(name, e.target.value);
      }}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      sx={props.sx}
      InputLabelProps={type === "date" ? { shrink: true } : undefined}
      inputProps={{ tabIndex: props.tabIndex }}
    />
  );
});

// تعريف مكون Select بشكل منفصل
const CustomSelect = React.memo(({ name, label, options, formik, ...props }) => (
  <FormControl fullWidth sx={props.sx}>
    <InputLabel>{label}</InputLabel>
    <Select
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      label={label}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
));

const PatientProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  // تعريف schema التحقق مرة واحدة باستخدام useMemo
  const validationSchema = useMemo(() => Yup.object({
    email: Yup.string().email("البريد الإلكتروني غير صالح").required("البريد الإلكتروني مطلوب"),
    phoneNumber: Yup.string().matches(/^\+?\d{10,15}$/, "رقم الهاتف غير صالح").required("رقم الهاتف مطلوب"),
    firstName: Yup.string().required("الاسم الأول مطلوب"),
    lastName: Yup.string().required("الاسم الأخير مطلوب"),
    birthDate: Yup.date().required("تاريخ الميلاد مطلوب").max(new Date(), "تاريخ الميلاد لا يمكن أن يكون في المستقبل"),
    nationality: Yup.string().required("الجنسية مطلوبة"),
    city: Yup.string().required("المدينة مطلوبة"),
    gender: Yup.string().required("الجنس مطلوب"),
    familyMembersCount: Yup.number().min(1, "يجب أن يكون عدد أفراد الأسرة على الأقل 1").required("عدد أفراد الأسرة مطلوب"),
    siblingRank: Yup.number().min(1, "يجب أن يكون ترتيب الطفل بين إخوته على الأقل 1").required("ترتيب الطفل بين إخوته مطلوب"),
    latestIqTestResult: Yup.number().min(0).max(200).nullable(),
    latestRightEarTestResult: Yup.number().min(0).max(100).nullable(),
    latestLeftEarTestResult: Yup.number().min(0).max(100).nullable()
  }), []);

  // تعريف options للselect مرة واحدة باستخدام useMemo
  const selectOptions = useMemo(() => ({
    nationality: [
      { value: "Egyptian", label: "مصري" },
      { value: "Saudi", label: "سعودي" },
      { value: "Emirati", label: "إماراتي" },
      { value: "Other", label: "أخرى" }
    ],
    gender: [
      { value: "male", label: "ذكر" },
      { value: "female", label: "أنثى" }
    ]
  }), []);

  const formik = useFormik({
    initialValues: {
      email: "",
      phoneNumber: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      nationality: "Egyptian",
      city: "",
      gender: "male",
      familyMembersCount: "",
      siblingRank: "",
      latestIqTestResult: "",
      latestRightEarTestResult: "",
      latestLeftEarTestResult: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      setUpdating(true);
      try {
        const updateData = {
          email: values.email,
          phoneNumber: values.phoneNumber,
          firstName: values.firstName,
          lastName: values.lastName,
          birthDate: values.birthDate,
          nationality: values.nationality,
          city: values.city,
          gender: values.gender,
          familyMembersCount: parseInt(values.familyMembersCount),
          siblingRank: parseInt(values.siblingRank),
          latestIqTestResult: values.latestIqTestResult ? parseFloat(values.latestIqTestResult) : null,
          latestRightEarTestResult: values.latestRightEarTestResult ? parseFloat(values.latestRightEarTestResult) : null,
          latestLeftEarTestResult: values.latestLeftEarTestResult ? parseFloat(values.latestLeftEarTestResult) : null
        };

        await axios.put(
          `https://speech-correction-api.azurewebsites.net/api/Profile/update-patient-profile`,
          updateData,
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );

        dispatch(loginSuccess({
          ...currentUser,
          ...updateData,
          profileImageUrl: currentUser.profileImageUrl
        }));

        toast.success("تم تحديث الملف الشخصي بنجاح!");
      } catch (error) {
        console.error("Update error:", error);
        toast.error("حدث خطأ أثناء تحديث البيانات!");
      } finally {
        setUpdating(false);
      }
    }
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `https://speech-correction-api.azurewebsites.net/api/Profile/get-patient-profile`,
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );

        const initialValues = {
          email: currentUser.email,
          phoneNumber: response.data.phoneNumber || "",
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          birthDate: response.data.birthDate?.split("T")[0] || "",
          nationality: currentUser.nationality || "Egyptian",
          city: response.data.city || "",
          gender: response.data.gender || "male",
          familyMembersCount: response.data.familyMembersCount || "",
          siblingRank: response.data.siblingRank || "",
          latestIqTestResult: response.data.latestIqTestResult || "",
          latestRightEarTestResult: response.data.latestRightEarTestResult || "",
          latestLeftEarTestResult: response.data.latestLeftEarTestResult || ""
        };

        formik.resetForm({ values: initialValues });
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("حدث خطأ أثناء جلب بيانات المريض");
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.email) {
      fetchPatientData();
    }
  }, [currentUser?.email, currentUser?.token]);

  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      fontFamily: '"Kidzhood Arabic", sans-serif',
      '& fieldset': {
        borderColor: '#fca43c',
        borderWidth: '1.5px'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1c8d8d',
        boxShadow: '0 0 8px rgba(28, 141, 141, 0.4)'
      }
    },
    '& .MuiInputLabel-root': {
      fontFamily: '"Kidzhood Arabic", sans-serif',
      color: '#1c8d8d',
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    '& .MuiFormHelperText-root': {
      fontFamily: '"Kidzhood Arabic", sans-serif',
      textAlign: 'right'
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{
        py: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <BackgroundWrapper>
      <Container maxWidth="md" sx={{
        py: 4,
        background: 'url("../assets/flower-bg.jpg") center / cover no-repeat',
        minHeight: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Paper elevation={3} sx={{
          p: 4,
          borderRadius: 5,
          width: '100%',
          maxWidth: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.84)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(5px)',
          transition: 'box-shadow 0.4s ease',
          // boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>
          {/* رأس الصفحة */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            position: 'relative'
          }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                mr: 2,
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: '#fca43c',
                color: '#fff',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: '#fca43c'
                }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontFamily: '"RTL Mocha Yemen Sadah", sans-serif',
                fontWeight: 'bold',
                color: '#1c8d8d',
                textShadow: '1px 1.5px 1px #2b2b2b',
                textAlign: 'center',
                width: '100%'
              }}
            >
              الملف الشخصي للمريض
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* صورة الملف الشخصي مع زر التعديل */}
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
            position: 'relative'
          }}>
            <Avatar
              src={currentUser.profileImageUrl}
              sx={{
                width: 120,
                height: 120,
                border: '5px solid #FFA726'
              }}
            />
            <IconButton
              onClick={() => setOpenImageModal(true)}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 330,
                backgroundColor: '#1c8d8d',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#fca43c',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Box>

          {/* مودال تعديل الصورة */}
          <Modal
            open={openImageModal}
            onClose={() => setOpenImageModal(false)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(5px)'
            }}
          >
            <Box sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              maxWidth: 500,
              width: '90%',
              outline: 'none'
            }}>
              <EditProfileImage
                onClose={() => setOpenImageModal(false)}
                currentImage={currentUser.profileImageUrl}
              />
            </Box>
          </Modal>

          {/* نموذج التعديل */}
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* المعلومات الأساسية */}
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="email"
                  label="البريد الإلكتروني"
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="firstName"
                  label="الاسم الأول"
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="phoneNumber"
                  label="رقم الهاتف"
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="lastName"
                  label="الاسم الأخير"
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="birthDate"
                  label="تاريخ الميلاد"
                  type="date"
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomSelect
                  name="gender"
                  label="الجنس"
                  options={selectOptions.gender}
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomSelect
                  name="nationality"
                  label="الجنسية"
                  options={selectOptions.nationality}
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="city"
                  label="المدينة"
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              {/* معلومات المريض الخاصة */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{
                  mt: 2,
                  mb: 2,
                  color: '#1c8d8d',
                  fontFamily: '"RTL Mocha Yemen Sadah", sans-serif',
                  textAlign: 'center'
                }}>
                  المعلومات الطبية
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="familyMembersCount"
                  label="عدد أفراد الأسرة"
                  type="number"
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="siblingRank"
                  label="ترتيب الطفل بين إخوته"
                  type="number"
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="latestIqTestResult"
                  label="نتيجة اختبار الذكاء (اختياري)"
                  type="number"
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="latestLeftEarTestResult"
                  label="نتيجة اختبار الأذن اليسرى (اختياري)"
                  type="number"
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="latestRightEarTestResult"
                  label="نتيجة اختبار الأذن اليمنى (اختياري)"
                  type="number"
                  formik={formik}
                  sx={fieldStyles}
                />
              </Grid>

              {/* زر الحفظ */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={updating ? <CircularProgress size={24} /> : <Save />}
                  disabled={updating}
                  sx={{
                    py: 2,
                    borderRadius: '50px',
                    fontFamily: '"Kidzhood Arabic", sans-serif',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    backgroundColor: '#1c8d8d',
                    '&:hover': {
                      backgroundColor: '#fca43c',
                      transform: 'scale(1.02)'
                    },
                    '& .MuiCircularProgress-root': {
                      color: 'white'
                    }
                  }}
                >
                  {updating ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </BackgroundWrapper>
  );
};

export default PatientProfilePage;