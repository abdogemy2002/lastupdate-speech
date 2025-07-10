import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
  styled,
  CircularProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { updateProfileImage } from '../../store/slices/userSlice';
import backgroundImage from '../../assets/flower-bg.jpg';



const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ProfileImageUploader = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.match('image.*')) {
      toast.error('الملف يجب أن يكون صورة');
      return;
    }

    // التحقق من حجم الملف
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 2MB');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setUploadedFile(file);
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error("المستخدم غير مسجل دخول");
      return;
    }

    if (!uploadedFile) {
      toast.warn("من فضلك اختر صورة أولاً");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      setLoading(true);

      // 1. رفع الصورة على السيرفر
      await axios.post(
        "https://speech-correction-api.azurewebsites.net/api/Profile/set-or-update-profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // 2. جلب رابط الصورة من السيرفر
      const getImageRes = await axios.get(
        "https://speech-correction-api.azurewebsites.net/api/Profile/get-profile-picture",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const imageUrl = getImageRes.data.pictureUrl;

      if (imageUrl) {
        // 3. حفظ الصورة في حالة Redux
        dispatch(updateProfileImage(imageUrl));

        // 4. حفظ رابط الصورة في localStorage
        localStorage.setItem("profileImageUrl", imageUrl);

        // 5. إكمال باقي الإجراءات
        toast.success("✅ تم تحديث صورة البروفايل بنجاح");
        localStorage.removeItem("isNewUser");
        navigate("/DoctorDashboard");
      } else {
        toast.error("لم يتم الحصول على رابط الصورة من السيرفر");
      }

    } catch (err) {
      console.error("Error:", err);
      toast.error("حدث خطأ أثناء عملية رفع الصورة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 3,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.84)',
          p: 6,
          borderRadius: 4,
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          width: '100%',
          maxWidth: '800px',
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: '#1c8d8d', 
            mb: 4, 
            fontFamily: 'RTL Mocha Yemen Sadah',
            fontWeight: 'bold'
          }}
        >
          اختر صورة البروفايل الخاصة بك
        </Typography>

        {/* معاينة الصورة */}
        <Box sx={{ 
          mb: 4,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Avatar
            src={previewImage || '/default-avatar.png'}
            sx={{
              width: 200,
              height: 200,
              border: '4px solid #1c8d8d',
              fontSize: '5rem'
            }}
          />
        </Box>

        {/* زر رفع الصورة */}
        <Box sx={{ mb: 4 }}>
          <Button
            component="label"
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<CloudUpload />}
            sx={{
              py: 3,
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: '#1c8d8d',
              color: '#1c8d8d',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              fontFamily: 'Kidzhood Arabic',
              '&:hover': {
                borderColor: '#fca43c',
                backgroundColor: 'rgba(28, 141, 141, 0.05)'
              }
            }}
          >
            {previewImage ? 'تغيير الصورة المختارة' : 'انقر لرفع صورة من جهازك'}
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            الحجم الأقصى: 2MB (JPEG, PNG)
          </Typography>
        </Box>

        {/* زر التأكيد */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={loading || !previewImage}
          sx={{
            py: 2,
            fontWeight: 'bold',
            fontSize: '1.3rem',
            fontFamily: 'Kidzhood Arabic',
            backgroundColor: '#1c8d8d',
            '&:hover': {
              backgroundColor: '#fca43c'
            },
            '&:disabled': {
              backgroundColor: '#e0e0e0'
            }
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={26} sx={{ color: 'white', mr: 1.5 }} />
              جارٍ رفع الصورة...
            </>
          ) : (
            'حفظ الصورة والمتابعة'
          )}
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfileImageUploader;