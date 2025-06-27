import React from 'react';
import childImage from '../../assets/vector.png';
import {
    Box,
    Button,
    IconButton,
    Stack,
    styled
} from '@mui/material';
import {
    PlayArrow as PlayArrowIcon,
    Bookmark as BookmarkIcon
} from '@mui/icons-material';
import RecordControlsGroup from './RecordControlsGroup';
import audioFile from '../../assets/Records/b.mp3';
import PromptDisplay from './PromptDisplay';

const MainContainer = styled(Box)(({ theme }) => ({
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
    overflow: 'visible', // مهم لظهور الموجة
    position: 'relative',
    [theme.breakpoints.up('md')]: {
        width: '70%'
    },
    [theme.breakpoints.up('lg')]: {
        width: '50%'
    }
}));

const TopSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flex: 1,
    gap: '0px',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px'
    },
}));

const ChildFigure = styled(Box)(({ theme }) => ({
    width: '30%',
    backgroundColor: '#FDFBF6',
    borderRadius: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // لإخفاء الأجزاء الزائدة
    '& img': {
        width: '80%', // تقليل عرض الصورة
        height: '80%', // تقليل ارتفاع الصورة
        objectFit: 'contain', // للحفاظ على التناسب
        transition: 'transform 0.3s ease', // تأثير سلس عند التكبير
    },
    [theme.breakpoints.down('sm')]: {
        width: '80%',
        height: '200px',
        marginBottom: '10px',
        '& img': {
            width: '70%',
            height: '70%',
        }
    },
}));

const PromptDisplayContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    backgroundColor: '#FDFBF6',
    borderRadius: '0px',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        width: '90%',
        height: '150px',
    },
}));

const WaveDivider = styled(Box)(({ theme }) => ({
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
        fill: '#18b9c0'
    },
    [theme.breakpoints.down('sm')]: {
        height: '30px'
    }
}));

const BottomControls = styled(Box)(({ theme }) => ({
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
        gap: '20px'
    }
}));

const SideButtons = styled(Stack)(({ theme }) => ({
    gap: '10px',
    zIndex: 3,
    flex: 1,
    marginLeft: '2.5%',
    maxWidth: '25%',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap'
    }
}));

const SideButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'white',
    color: '#666666',
    fontWeight: 'bold',
    fontFamily: 'Kidzhood Arabic',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '16px',
    flex: 1,
    minWidth: '120px',
    '&:hover': {
        backgroundColor: '#f5f5f5'
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        padding: '10px 15px',
        flex: 'none'
    }
}));

const MicCircle = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3,
  flexShrink: 0,
  position: 'relative',
  boxShadow: '0 0 0 0 rgba(252, 164, 60, 0.7)',
  animation: 'pulse 1.5s infinite',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 0 0 10px rgba(252, 164, 60, 0)',
  },
  '& svg': {
    position: 'relative',
    zIndex: 2,
  },
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(252, 164, 60, 0.7)',
    },
    '70%': {
      boxShadow: '0 0 0 15px rgba(252, 164, 60, 0)',
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(252, 164, 60, 0)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    width: '80px',
    height: '80px',
    order: -2,
    '@keyframes pulse': {
      '0%': {
        boxShadow: '0 0 0 0 rgba(252, 164, 60, 0.7)',
      },
      '70%': {
        boxShadow: '0 0 0 10px rgba(252, 164, 60, 0)',
      },
      '100%': {
        boxShadow: '0 0 0 0 rgba(252, 164, 60, 0)',
      },
    }
  }
}));
const NextButton = styled(Button)(({ theme }) => ({
    width: '100%',
    maxWidth: '50%',
    margin: '20px auto',
    display: 'block',
    backgroundColor: 'orange',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '30px',
    fontFamily:"RTL Mocha Yemen Sadah",
    padding: '12px 0',
    borderRadius: '12px',
    '&:hover': {
        backgroundColor: 'darkorange'
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        padding: '10px',
        width: 'calc(100% - 30px)',
        maxWidth: '100%'
    },
}));

const VoiceComponent = () => {
    const [currentPrompt, setCurrentPrompt] = React.useState('امر امير الامراء بحفر بئر في الصحراء');
    
    const handleRecordComplete = (audioBlob) => {
        // Handle the recorded audio blob here
        console.log('Recording complete:', audioBlob);
    };

    return (
        <Box sx={{
            mt: 4,
            width: '100%',
            padding: '0 15px',
            boxSizing: 'border-box'
        }}>
            <MainContainer>
                <TopSection>
                    <ChildFigure>
                        <img src={childImage} alt="صورة الطفل" />
                    </ChildFigure>
                    
                    <PromptDisplayContainer>
                        <PromptDisplay prompt={currentPrompt} />
                    </PromptDisplayContainer>
                </TopSection>

                <BottomControls>
                    <WaveDivider>
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: 'block' }}>
                            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                                opacity=".25"
                            />
                            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                                opacity=".5"
                            />
                            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                            />
                        </svg>
                    </WaveDivider>

                    <SideButtons>
                        <SideButton startIcon={<PlayArrowIcon sx={{ color: '#FCA43C', fontSize: '36px' }} />}>
                            اسمع صوتك
                        </SideButton>
                        <SideButton startIcon={<BookmarkIcon sx={{ color: '#FCA43C', fontSize: '20px' }} />}>
                            كلماتي
                        </SideButton>
                    </SideButtons>

                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <RecordControlsGroup
                            audioSrc={audioFile}
                            onRecordComplete={handleRecordComplete}
                            sx={{
                                width: '100%',
                                maxWidth: '400px',
                                backgroundColor: 'rgba(255,255,255,0.2)'
                            }}
                        />
                    </Box>
                </BottomControls>
            </MainContainer>

            <NextButton>إلى بعده</NextButton>
        </Box>
    );
};

export default VoiceComponent;