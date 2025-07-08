
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#fca43c', 
    },
    secondary: {
      main: '#20B2AA', 
    },
    background: {
      default: '#fffaf0', 
    },
    text: {
      primary: '#2b2b2b', 
    },
  },
  typography: {
    fontFamily: 'RTL Mocha Yemen Sadah, Arial, sans-serif',
    h1: {
      fontFamily: 'Kidzhood Arabic, Arial, sans-serif',
    },
    h2: {
      fontFamily: 'Kidzhood Arabic, Arial, sans-serif',
    },
    h3: {
      fontFamily: 'Kidzhood Arabic, Arial, sans-serif',
    },
    
  },
});

export default theme;