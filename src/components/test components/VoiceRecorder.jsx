import React from 'react';
import {
    Box,
    Button,
    IconButton,
    LinearProgress,
    Stack,
    styled
} from '@mui/material';
import {
    Mic as MicIcon,
    Replay as ReplayIcon,
    PlayArrow as PlayArrowIcon,
    Bookmark as BookmarkIcon
} from '@mui/icons-material';

// Import the font file
import mochaYemenFont from '../../assets/fonts/RTL-MochaYemen-Sadah.otf';

// Create global styles with the font face
const GlobalStyle = styled('div')`
  @font-face {
    font-family: "RTL Mocha Yemen Sadah";
    src: url(${mochaYemenFont}) format("opentype");
    font-display: swap;
  }
`;

const StyledWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: '#18b9c0',
    padding: '25px 20px',
    borderRadius: '16px',
    width: '100%', // تغيير من maxWidth إلى width
    margin: '0 auto', // تعديل الهامش
    fontFamily: '"RTL Mocha Yemen Sadah", Tahoma, sans-serif',
}));

const MicCircle = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    width: '4.5rem',
    height: '4.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const ControlsBox = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '14px',
    padding: '5px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '10px',
    fontWeight: 'bold', 
    fontFamily: '"RTL Mocha Yemen Sadah"', // Updated font family
    color: '#18b9c0',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&.words': {
        border: '2px solid orange',
    },
}));

const NextButton = styled(Button)(({ theme }) => ({
    width: '100%',
    backgroundColor: 'orange',
    color: 'white',
    padding: '12px 0',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '16px',
    fontFamily: '"RTL Mocha Yemen Sadah"', // Updated font family
    marginTop: '10px',
    '&:hover': {
        backgroundColor: 'darkorange',
    },
}));

const VoiceComponent = () => {
    return (
        <GlobalStyle>
            <StyledWrapper>
                {/* Progress Bar */}
                <Box sx={{ mb: '20px', position: 'relative' }}>
                    <LinearProgress
                        variant="determinate"
                        value={55}
                        sx={{
                            height: '4px',
                            backgroundColor: 'white',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: 'orange',
                            }
                        }}
                    />
                    <Box
                        sx={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: 'orange',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '-4px',
                            left: '55%',
                        }}
                    />
                </Box>

                {/* Controls + Mic */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: '20px' }}
                >
                    <MicCircle>
                        <MicIcon sx={{ fontSize: '34px', color: '#18b9c0' }} />
                    </MicCircle>

                    <ControlsBox>
                        <IconButton>
                            <ReplayIcon sx={{ fontSize: '30px', color: '#18b9c0' }} />
                        </IconButton>
                        <IconButton>
                            <PlayArrowIcon sx={{ fontSize: '30px', color: '#18b9c0' }} />
                        </IconButton>
                        <IconButton>
                            <BookmarkIcon sx={{ fontSize: '30px', color: '#18b9c0' }} />
                        </IconButton>
                    </ControlsBox>
                </Stack>

                {/* Buttons */}
                <Stack direction="row" spacing={1} sx={{ my: '25px' }}>
                    <ActionButton startIcon={<PlayArrowIcon sx={{ fontSize: '16px' }} />}>
                        اسمع صوتك
                    </ActionButton>
                    <ActionButton
                        className="words"
                        startIcon={<BookmarkIcon sx={{ fontSize: '16px' }} />}
                    >
                        كلماتي
                    </ActionButton>
                </Stack>

                {/* Next Button */}
                <NextButton>الى بعده</NextButton>
            </StyledWrapper>
        </GlobalStyle>
    );
};

export default VoiceComponent;