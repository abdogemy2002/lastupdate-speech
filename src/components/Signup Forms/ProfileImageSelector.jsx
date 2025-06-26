import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  styled
} from '@mui/material';
import { CloudUpload, Check } from '@mui/icons-material';
import { updateProfileImage } from '../../store/slices/userSlice';

// صور الأفاتار
const avatarImages = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  url: `src/assets/animals/${i + 1}.png`
}));

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

const ProfileImageSelector = ({ onAvatarSelect, onImageUpload }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 2MB');
        return;
      }
      const imageUrl = URL.createObjectURL(file); // تحويل الملف إلى رابط
      setPreviewImage(imageUrl);
      setSelectedAvatar(null);
      setUploadedFile(file);
      onImageUpload(imageUrl); // تأكد من تمرير الرابط وليس الملف
    }
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar.id);
    setPreviewImage(null);
    setUploadedFile(null);
    onAvatarSelect(avatar.url);
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error("المستخدم غير مسجل دخول");
      return;
    }

    const formData = new FormData();

    if (uploadedFile) {
      formData.append("file", uploadedFile);
    } else if (selectedAvatar !== null) {
      try {
        const response = await fetch(
          avatarImages.find(img => img.id === selectedAvatar).url
        );
        const blob = await response.blob();
        const file = new File([blob], `avatar${selectedAvatar}.png`, { type: 'image/png' });
        formData.append("file", file);
      } catch (error) {
        toast.error("حدث خطأ أثناء تحميل صورة الأفاتار");
        return;
      }
    } else {
      toast.warn("من فضلك اختر صورة أولاً");
      return;
    }

    try {
      setLoading(true);

      // 1. رفع الصورة على السيرفر
      const uploadRes = await axios.post(
        "https://speech-correction-api.azurewebsites.net/api/Profile/set-profile-picture",
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
      console.log(imageUrl)

      if (imageUrl) {
        // 3. حفظ الصورة في حالة Redux
        dispatch(updateProfileImage(imageUrl));

        // 4. حفظ رابط الصورة في localStorage بنفس المفتاح المستخدم لاحقًا
        localStorage.setItem("profileImageUrl", imageUrl);

        // 5. إكمال باقي الإجراءات
        toast.success("✅ تم تحديث صورة البروفايل بنجاح");
        localStorage.removeItem("isNewUser");
        navigate("/SelectLetters");
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
    <Paper
      elevation={6}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.84)',
        p: 4,
        borderRadius: 4,
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
        maxWidth: 600,
        margin: 'auto'
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: '#1c8d8d', mb: 3, textAlign: 'center', fontFamily: 'RTL Mocha Yemen Sadah' }}>
        اختر صورة البروفايل
      </Typography>

      {/* رفع صورة مخصصة */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
          رفع صورة مخصصة
        </Typography>
        <Button
          component="label"
          variant="outlined"
          fullWidth
          startIcon={<CloudUpload />}
          sx={{
            py: 2,
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: '#1c8d8d',
            color: '#1c8d8d',
            fontWeight: 'bold',
            fontFamily: 'Kidzhood Arabic',
            '&:hover': {
              borderColor: '#fca43c',
              backgroundColor: 'rgba(28, 141, 141, 0.05)'
            }
          }}
        >
          {previewImage ? 'تم اختيار صورة' : 'انقر لرفع صورة'}
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
        <Typography variant="caption" color="text.secondary">
          الحجم الأقصى: 2MB
        </Typography>

        {previewImage && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={previewImage}
              sx={{
                width: 100,
                height: 100,
                border: '3px solid #1c8d8d',
              }}
            />
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          أو
        </Typography>
      </Divider>

      {/* اختيار صورة أفاتار */}
      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
        اختر من الصور الجاهزة
      </Typography>
      <Grid container spacing={2}>
        {avatarImages.map((avatar) => (
          <Grid item xs={3} sm={2.4} key={avatar.id}>
            <IconButton onClick={() => handleAvatarSelect(avatar)} sx={{ p: 0 }}>
              <Avatar
                src={avatar.url}
                sx={{
                  width: 56,
                  height: 56,
                  border: selectedAvatar === avatar.id ? '3px solid #fca43c' : 'none',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {selectedAvatar === avatar.id && (
                  <Check
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: '#fca43c',
                      color: 'white',
                      borderRadius: '50%',
                      fontSize: 16,
                      p: 0.5
                    }}
                  />
                )}
              </Avatar>
            </IconButton>
          </Grid>
        ))}
      </Grid>

      {/* زرار تأكيد الاختيار */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 4,
          py: 1.5,
          fontWeight: 'bold',
          fontSize: '1.1rem',
          fontFamily: 'Kidzhood Arabic',
          backgroundColor: '#1c8d8d',
          '&:hover': {
            backgroundColor: '#fca43c'
          }
        }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'جارٍ الرفع...' : 'تأكيد الاختيار'}
      </Button>
    </Paper>
  );
};

export default ProfileImageSelector;
