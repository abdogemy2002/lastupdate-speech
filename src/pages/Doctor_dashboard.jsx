import React from 'react';
import { Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import BackgroundWrapper from '../components/shared/BackgroundWrapper';
import NavigationTabs from '../components/DocDashboard/DocDashTabs';
import DocWallet from '../components/DocDashboard/DocWallet';
import DoctorSessions from '../components/DocDashboard/DoctorSessions.JSX';
const DashboardPage = () => {

  const showWallet = location.pathname.endsWith('/DocWallet');

  return (
    <BackgroundWrapper>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 0 }}>
        <NavigationTabs />
        <Box sx={{ mt: 3 }}>
          {showWallet ? (
            <DocWallet />
          ) : (
            <>
              <DoctorSessions />
            </>
          )}
        </Box>
      </Container>
    </BackgroundWrapper>
  );
};

export default DashboardPage;