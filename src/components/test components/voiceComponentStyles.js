// src/components/voice/voiceComponentStyles.js
import { Box, Button, Stack, Typography, styled } from '@mui/material';

export const MainContainer = styled(Box)(({ theme }) => ({
    width: '50%',
    height: 'auto',
    minHeight: '70vh',
    margin: 'auto',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    fontFamily: 'Tahoma, sans-serif',
    overflow: 'visible',
    position: 'relative',
    [theme.breakpoints.up('md')]: { width: '70%' },
    [theme.breakpoints.up('lg')]: { width: '50%' },
}));

export const TopSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flex: 1,
    gap: '0px',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px',
    },
}));

export const ChildFigure = styled(Box)(({ theme }) => ({
    width: '30%',
    height: '490px',
    backgroundColor: '#FDFBF6',
    borderRadius: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    '& img': {
        width: '80%',
        height: '80%',
        objectFit: 'contain',
        transition: 'transform 0.3s ease',
    },
    [theme.breakpoints.down('sm')]: {
        width: '80%',
        height: '200px',
        marginBottom: '10px',
        '& img': {
            width: '70%',
            height: '70%',
        },
    },
}));

export const PromptDisplayContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    backgroundColor: '#FDFBF6',
    borderRadius: '0px',
    height: '490px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
        width: '90%',
        height: '150px',
    },
}));

export const WaveDivider = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: '100%',
    left: 0,
    width: '100%',
    height: '40px',
    lineHeight: 0,
    zIndex: 1,
    '& svg': {
        display: 'block',
        width: '100%',
        height: '100%',
        transform: 'scaleY(-1)',
    },
    '& path': {
        fill: '#18b9c0',
    },
    [theme.breakpoints.down('sm')]: {
        height: '30px',
    },
}));

export const BottomControls = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#18b9c0',
    padding: '20px',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
    position: 'relative',
    zIndex: 2,
    flexWrap: 'wrap',
    gap: '15px',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        padding: '15px',
        gap: '20px',
    },
}));

export const SideButtons = styled(Stack)(({ theme }) => ({
    gap: '10px',
    zIndex: 3,
    flex: 1,
    marginLeft: '2.5%',
    maxWidth: '25%',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
}));

export const SideButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'white',
    color: '#666666',
    fontWeight: 'bold',
    fontFamily: 'Kidzhood Arabic',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '16px',
    flex: 1,
    minWidth: '120px',
    '&:hover': { backgroundColor: '#f5f5f5' },
    '&.Mui-disabled': {
        color: '#ccc',
        '& svg': {
            color: '#ccc !important',
        },
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        padding: '10px 15px',
        flex: 'none',
    },
}));

export const NextButton = styled(Button)(({ theme }) => ({
    width: '100%',
    maxWidth: '50%',
    margin: '20px auto',
    display: 'block',
    backgroundColor: '#FCA43C',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: 'RTL Mocha Yemen Sadah',
    padding: '12px 0',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#e5942e',
        transform: 'scale(1.03)',
    },
    '&.Mui-disabled': {
        backgroundColor: '#ccc',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
        padding: '10px',
        width: 'calc(100% - 30px)',
        maxWidth: '100%',
    },
}));

export const LoadingContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '20px',
});
