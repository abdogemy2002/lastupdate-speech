import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Avatar,
    IconButton,
    Paper,
    Divider,
    Chip,
    Tabs,
    Tab,
    styled
} from '@mui/material';
import {
    PlayArrow,
    CheckCircle,
    VolumeUp,
    ChevronLeft
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

// ============= Styled Components =============
const MainContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(4),
    maxWidth: '1200px',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const TrainingPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    position: 'relative',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    backgroundColor: '#20B2AA',
    color: '#fff',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
}));

const LevelTitle = styled(Typography)(({ theme }) => ({
    fontFamily: "'Tajawal', sans-serif",
    fontWeight: 700,
    fontSize: '2rem',
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
        marginTop: theme.spacing(1),
    },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-indicator': {
        backgroundColor: '#FCA43C',
        height: 4,
    },
    backgroundColor: '#f5f5f5',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    fontFamily: "'Tajawal', sans-serif",
    fontWeight: 600,
    fontSize: '1rem',
    color: '#333',
    '&.Mui-selected': {
        color: '#20B2AA',
    },
}));

const WordList = styled(List)(({ theme }) => ({
    padding: 0,
    backgroundColor: '#fff',
}));

const WordListItem = styled(ListItem)(({ theme }) => ({
    padding: 0,
    marginBottom: theme.spacing(1),
    '&:last-child': {
        marginBottom: 0,
    },
}));

const WordButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: '8px',
    padding: theme.spacing(2),
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
        backgroundColor: '#E0F7FA',
        '&:hover': {
            backgroundColor: '#B2EBF2',
        },
    },
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
}));

const WordAvatar = styled(Avatar)(({ theme, completed }) => ({
    backgroundColor: completed ? '#FCA43C' : '#BDBDBD', // تغيير اللون إلى البرتقالي للمكتمل
    color: '#fff',
    marginRight: theme.spacing(2),
    width: 40,
    height: 40,
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
    color: '#20B2AA',
    '&:hover': {
        backgroundColor: 'rgba(32, 178, 170, 0.1)',
    },
}));

const ProgressChip = styled(Chip)(({ theme }) => ({
    backgroundColor: '#FDFBF6',
    color: '#20B2AA',
    fontWeight: 700,
    fontSize: '1rem',
    padding: theme.spacing(0.5),
}));

const BackButton = styled(IconButton)(({ theme }) => ({
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: theme.spacing(2),
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
}));


// ============= Main Component =============
const TrainingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [levelData, setLevelData] = useState(null);
    const [selectedWord, setSelectedWord] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    // Memoize grouped words calculation
    const groupedWords = useMemo(() => {
        if (!levelData?.words) return {};
        return levelData.words.reduce((acc, word) => {
            const letter = word.letterSymbol;
            if (!acc[letter]) {
                acc[letter] = [];
            }
            acc[letter].push(word);
            return acc;
        }, {});
    }, [levelData?.words]);

    // Load initial data (fixed to prevent infinite loops)
    useEffect(() => {
        if (location.state?.levelData) {
            setLevelData(prev => 
                JSON.stringify(prev) === JSON.stringify(location.state.levelData) 
                    ? prev 
                    : location.state.levelData
            );
        } else if (!levelData) {
            navigate('/learning-stages');
        }
    }, [location.state?.levelData]); // More specific dependency

    // Clean up audio on unmount
    useEffect(() => {
        return () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
        };
    }, [currentAudio]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const playAudio = useCallback((audioUrl) => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        setIsPlaying(true);

        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
        });

        audio.onended = () => {
            setIsPlaying(false);
        };
    }, [currentAudio]);

    const handleWordClick = useCallback((word) => {
        setSelectedWord(word);
        
        // Find current word index and remaining words
        const currentIndex = levelData.words.findIndex(w => w.id === word.id);
        const remainingWords = levelData.words.slice(currentIndex + 1);
        
        // Navigate to training page with word data
        navigate('/TrainingPage', {
            state: {
                currentWord: word,
                remainingWords,
                levelData
            }
        });
    }, [levelData, navigate]);

    const handleBack = () => {
        navigate('/learning-stages');
    };

    if (!levelData) {
        return (
            <MainContainer>
                <Typography variant="h6" align="center">جاري تحميل البيانات...</Typography>
            </MainContainer>
        );
    }

    const letters = Object.keys(groupedWords);
    const currentLetter = letters[activeTab] || '';
    const currentWords = groupedWords[currentLetter] || [];

    return (
        <MainContainer maxWidth="md">
            <TrainingPaper elevation={3}>
                <HeaderBox>
                    <BackButton onClick={handleBack}>
                        <ChevronLeft fontSize="large" />
                    </BackButton>
                    <LevelTitle variant="h4" component="h1">
                        المستوى {levelData.level}
                    </LevelTitle>
                    <ProgressChip
                        label={`${levelData.words.filter(w => w.isCompleted).length}/${levelData.words.length}`}
                    />
                </HeaderBox>

                <Divider sx={{ borderColor: '#e0e0e0' }} />

                <Box sx={{ px: 3, pt: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 600 }}>
                        الكلمات المطلوبة:
                    </Typography>

                    {/* تبويبات الحروف */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <StyledTabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                        >
                            {letters.map((letter) => (
                                <StyledTab
                                    key={letter}
                                    label={`حرف ${letter}`}
                                />
                            ))}
                        </StyledTabs>
                    </Box>

                    {/* قائمة الكلمات للحرف المحدد */}
                    <WordList>
                        {currentWords.map((word) => (
                            <WordListItem
                                key={word.id}
                                secondaryAction={
                                    <PlayButton 
                                        edge="end" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playAudio(word.exampleRecordingUrl);
                                        }}
                                    >
                                        {isPlaying && selectedWord?.id === word.id ? (
                                            <VolumeUp color="primary" />
                                        ) : (
                                            <PlayArrow />
                                        )}
                                    </PlayButton>
                                }
                                disablePadding
                            >
                                <WordButton
                                    selected={selectedWord?.id === word.id}
                                    onClick={() => handleWordClick(word)}
                                >
                                    <WordAvatar completed={word.isCompleted}>
                                        {word.isCompleted ? <CheckCircle /> : word.letterSymbol}
                                    </WordAvatar>
                                    <ListItemText
                                        primary={word.name}
                                        secondary={`حرف ${word.letterSymbol}`}
                                        primaryTypographyProps={{
                                            fontFamily: "'Tajawal', sans-serif",
                                            fontWeight: 'medium',
                                            variant: 'body1',
                                            color: '#333',
                                        }}
                                        secondaryTypographyProps={{
                                            fontFamily: "'Tajawal', sans-serif",
                                            color: '#666',
                                        }}
                                    />
                                </WordButton>
                            </WordListItem>
                        ))}
                    </WordList>
                </Box>
            </TrainingPaper>
        </MainContainer>
    );
};

export default TrainingPage;