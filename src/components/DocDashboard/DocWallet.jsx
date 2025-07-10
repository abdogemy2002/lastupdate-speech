// DoctorWalletPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DoctorWalletPage = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user.token);

  const fetchWalletData = async () => {
    try {
      const response = await axios.get(
        'https://speech-correction-api.azurewebsites.net/api/Doctor/get-doctor-wallet',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWalletData(response.data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setError('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <Box
      height="100vh"
      overflow="auto"
      // bgcolor="#f9f9f9"
      display="flex"
      justifyContent="center"
      alignItems="start"
      p={2}
      sx={{ fontFamily: "'Tajawal', sans-serif", }}
    >
      <Box width="100%" maxWidth="1200px">
        <Card
          sx={{
            backgroundColor: '#20B2AA',
            borderRadius: '16px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
            mb: 4,
          }}
        >
          <CardHeader
            title="رصيد المحفظة"
            titleTypographyProps={{
              variant: 'h5',
              sx: {
                fontFamily: "'Tajawal', sans-serif",
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'right',
              }
            }}
          />
          <CardContent>
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                p: 2,
                border: '3px solid #FCA43C',
                boxShadow: '0 2px 8px rgba(219, 0, 0, 0.05)',
              }}
            >
              {loading ? (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <>
                  <Box textAlign="center" mb={3}>
                    <Typography variant="h5" color="#fca43c" fontWeight="bold" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                      الرصيد الكلي
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="#20B2AA" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                      {walletData.totalAmount} EGP
                    </Typography>
                  </Box>

                  <Box 
                    sx={{ 
                      maxHeight: '400px',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#20B2AA',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: '#1E9C96',
                      },
                      pr: 1, // Add some padding so scrollbar doesn't overlap content
                    }}
                  >
                    <Box display="flex" flexDirection="column" gap={2}>
                      {walletData.patients.map((patient, index) => (
                        <Card
                          key={index}
                          variant="outlined"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 2,
                            py: 1,
                            backgroundColor: '#f5f5f5',
                            borderRadius: '12px',
                            border: '1px solid #ddd',
                            fontFamily: "'Tajawal', sans-serif",
                            minHeight: '80px',
                          }}
                        >
                          <Avatar
                            src={patient.profilePictureUrl}
                            alt={patient.displayName}
                            sx={{ width: 56, height: 56 }}
                          />
                          <Box flex="1" ml={2}>
                            <Typography variant="subtitle1" fontWeight="bold" color="#333" sx={{ fontFamily: "'Tajawal', sans-serif" }} >
                              {patient.displayName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                              عدد الجلسات: {patient.sessionsCount}
                            </Typography>
                          </Box>
                          <Typography variant="subtitle1" fontWeight="bold" color="green" sx={{ fontFamily: "'Tajawal', sans-serif" }}>
                            +{patient.amountPaid} EGP
                          </Typography>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DoctorWalletPage;