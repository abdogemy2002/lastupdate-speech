// In your theme configuration file
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#fca43c', // bright orange
    },
    secondary: {
      main: '#20B2AA', // teal green
    },
    background: {
      default: '#fffaf0', // warm beige
    },
    text: {
      primary: '#2b2b2b', // charcoal grey
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
    // Add other heading variants as needed
  },
});

export default theme;