import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Avatar,
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  styled
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import OffCanvasSidebar from "./OffCanvasSidebar";
import { logout, loginSuccess } from "../store/slices/userSlice";

const CustomNavbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, firstName, profileImageUrl } = useSelector((state) => state.user);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);

  // ✅ محاولة استعادة البيانات من localStorage لو فُقدت بعد reload
  useEffect(() => {
  const storedAuth = localStorage.getItem("persist:root");
  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth);
      const parsedUser = parsed.user ? JSON.parse(parsed.user) : null;

      if (parsedUser && parsedUser.isAuthenticated && !isAuthenticated) {
        dispatch(loginSuccess({
          token: parsedUser.token,
          email: parsedUser.email,
          firstName: parsedUser.firstName,
          lastName: parsedUser.lastName,
          userType: parsedUser.userType,
          profileImageUrl: parsedUser.profileImageUrl
        }));
      }
    } catch (err) {
      console.error("فشل في استرجاع البيانات من localStorage:", err);
    }
  }
}, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("persist:root");
    navigate("/");
  };

  const navItems = [
    { text: 'الرئيسية', href: '#HomePage' },
    { text: 'من نحن', href: '#about' },
    { text: 'المميزات', href: '#features' },
    { text: 'للأطباء', href: '#doctors' },
    { text: 'للآباء', href: '#parents' },
  ];

  const UserAvatar = styled(Avatar)({
    width: 50,
    height: 50,
    border: '4px solid #fca43c',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  });

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', boxShadow: '0 6px 6px rgba(0, 0, 0, 0.1)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ width: '100%', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            component="img"
            src="src/assets/KHATWTNTK-logo-notext.svg"
            alt="Logo"
            onClick={() => navigate("/")}
            sx={{
              height: 70,
              padding: '5px',
              mr: 2,
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                filter: 'drop-shadow(0 0 10px #ffe7cd)'
              }
            }}
          />

          {/* Mobile menu */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop nav */}
          {!isMobile && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fca43c',
              padding: '5px 20px',
              borderRadius: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  href={item.href}
                  sx={{
                    color: '#2b2b2b',
                    fontFamily: '"Kidzhood Arabic", sans-serif',
                    fontWeight: 'bold',
                    borderRadius: '25px',
                    padding: '10px 20px',
                    '&:hover': {
                      backgroundColor: '#20B2AA',
                      color: 'white'
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* User Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <IconButton onClick={toggleOffcanvas} sx={{ p: 0 }}>
                  <UserAvatar
                    alt={firstName || "المستخدم"}
                    src={profileImageUrl || "src/assets/user-img.jpg"} // ← استخدم الصورة اللي جاية من API أو fallback
                  />
                </IconButton>
                <OffCanvasSidebar
                  show={showOffcanvas}
                  onHide={toggleOffcanvas}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#fca43c',
                  color: 'white',
                  fontFamily: '"Kidzhood Arabic", sans-serif',
                  fontWeight: 'bold',
                  borderRadius: '25px',
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: '#20B2AA'
                  }
                }}
                onClick={() => navigate("/signup")}
              >
                ابدأ الآن
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            backgroundColor: 'white'
          },
        }}
      >
        <Box onClick={() => setMobileOpen(false)} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ my: 2, color: '#20B2AA', fontFamily: '"Kidzhood Arabic", sans-serif' }}>
            خواتنك
          </Typography>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} component="a" href={item.href}>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontFamily: '"Kidzhood Arabic", sans-serif',
                    fontWeight: 'bold'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default CustomNavbar;
