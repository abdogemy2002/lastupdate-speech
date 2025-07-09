import React, { useState, useRef } from 'react'; 
import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Box, Typography
} from '@mui/material';

const Assessment = ({ open, onClose, questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));
    const [showFinalScreen, setShowFinalScreen] = useState(false);

    const handleAnswerChange = (value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestion] = value === 'yes';
        setAnswers(updatedAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            const hasYesAnswer = answers.includes(true);
            if (hasYesAnswer) {
                setShowFinalScreen(true);
            } else {
                onClose();
            }
        }
    };

    const handleClose = () => {
        onClose();
        setCurrentQuestion(0);
        setAnswers(Array(questions.length).fill(null));
        setShowFinalScreen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '16px',
                    minHeight: '500px',
                    backgroundColor: '#fff',
                    border: '3px solid #FCA43C',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                    px: 2,
                    py: 3,
                },
            }}
        >
            {!showFinalScreen ? (
                <>
                    <DialogTitle
                        sx={{
                            textAlign: 'center',
                            fontFamily: "'Tajawal', sans-serif",
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            color: '#444',
                        }}
                    >
                        {currentQuestion + 1} / {questions.length}
                    </DialogTitle>

                    <DialogContent sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontFamily: "'Tajawal', sans-serif", fontSize: '1.1rem', color: '#333', mb: 3 }}>
                            {questions[currentQuestion]}
                        </Typography>

                        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={2}>
                            <Button
                                variant={answers[currentQuestion] === true ? 'contained' : 'outlined'}
                                onClick={() => handleAnswerChange('yes')}
                                sx={{
                                    minWidth: 100, height: 60, fontSize: '1.1rem', fontWeight: 'bold',
                                    fontFamily: "'Tajawal', sans-serif", borderRadius: '12px',
                                    backgroundColor: answers[currentQuestion] === true ? '#FCA43C' : '#fff',
                                    color: answers[currentQuestion] === true ? '#000' : '#555',
                                    border: '2px solid #FCA43C',
                                    boxShadow: answers[currentQuestion] === true ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
                                }}
                            >
                                نعم
                            </Button>

                            <Button
                                variant={answers[currentQuestion] === false ? 'contained' : 'outlined'}
                                onClick={() => handleAnswerChange('no')}
                                sx={{
                                    minWidth: 100, height: 60, fontSize: '1.1rem', fontWeight: 'bold',
                                    fontFamily: "'Tajawal', sans-serif", borderRadius: '12px',
                                    backgroundColor: answers[currentQuestion] === false ? '#20B2AA' : '#fff',
                                    color: answers[currentQuestion] === false ? '#fff' : '#555',
                                    border: '2px solid #20B2AA',
                                    boxShadow: answers[currentQuestion] === false ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
                                    ":hover":{backgroundColor: answers[currentQuestion] === false ? '#1E88E5' : '#fff'}
                                }}
                            >
                                لا
                            </Button>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ justifyContent: 'space-between', px: 3, pt: 2 }}>
                        <Button
                            onClick={handleClose}
                            sx={{
                                fontFamily: "'Tajawal', sans-serif",
                                fontWeight: 'bold',
                                color: '#666',
                                '&:hover': {
                                    color: '#FCA43C'
                                }
                            }}
                        >
                            الرجوع
                        </Button>
                        <Button
                            onClick={handleNextQuestion}
                            disabled={answers[currentQuestion] === null}
                            variant="contained"
                            sx={{
                                backgroundColor: '#FCA43C',
                                color: '#fff',
                                fontFamily: "'Tajawal', sans-serif",
                                fontWeight: 'bold',
                                px: 4,
                                borderRadius: '12px',
                                '&:hover': { backgroundColor: '#FFB74D' }
                            }}
                        >
                            {currentQuestion < questions.length - 1 ? 'التالي' : 'إنهاء'}
                        </Button>
                    </DialogActions>
                </>
            ) : (
                <DialogContent sx={{ textAlign: 'center', py: 5 }}>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/src/assets/docConsult.svg"
                            alt="Doctor Consultation"
                            width="200"
                            height="200"
                        />
                    </Box>

                    <Typography variant="h6" sx={{
                        fontFamily: "'Tajawal', sans-serif",
                        fontWeight: 'bold',
                        fontSize: '1.3rem',
                        color: '#E65100',
                        mb: 3
                    }}>
                        بناءً على إجاباتك، من الأفضل مراجعة أخصائي قبل بدء التدريب.
                    </Typography>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        sx={{
                            backgroundColor: '#FCA43C',
                            color: '#fff',
                            fontFamily: "'Tajawal', sans-serif",
                            fontWeight: 'bold',
                            px: 4,
                            borderRadius: '12px',
                            '&:hover': { backgroundColor: '#FFB74D' }
                        }}
                    >
                        حسنًا
                    </Button>
                </DialogContent>
            )}
        </Dialog>
    );
};

export default Assessment;