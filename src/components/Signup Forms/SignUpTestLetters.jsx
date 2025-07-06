import React, { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";
import backgroundPattern from '../../assets/flower-bg.jpg';
import { useSelector } from 'react-redux'; // Import useSelector

const arabicLetters = [
    "ا", "ب", "ت", "ث", "ج", "ح", "خ",
    "د", "ذ", "ر", "ز", "س", "ش", "ص",
    "ض", "ط", "ظ", "ع", "غ", "ف", "ق",
    "ك", "ل", "م", "ن", "ه", "و", "ي",
];

const LetterTrainingPage = () => {
    const navigate = useNavigate();
    const [selectedLetters, setSelectedLetters] = useState([]);
    const [trainAll, setTrainAll] = useState(false);
    
    // Get token from Redux store
    const token = useSelector(state => state.user.token);

    const handleLetterToggle = (letter) => {
        setSelectedLetters((prev) =>
            prev.includes(letter)
                ? prev.filter((l) => l !== letter)
                : [...prev, letter]
        );
    };

    const handleTrainAllChange = (e) => {
        setTrainAll(e.target.checked);
        if (e.target.checked) {
            setSelectedLetters([...arabicLetters]);
        } else {
            setSelectedLetters([]);
        }
    };

    const storeSelectedLetters = async () => {
        // تحضير البيانات حسب متطلبات API
        const issuesData = selectedLetters.map(letter => {
            const letterIndex = arabicLetters.indexOf(letter);
            return {
                letterId: letterIndex + 1, // الفهرس من 1 إلى 28
                confidence: 0 // قيمة الثقة دائماً 0 كما طُلب
            };
        });

        // لوج البيانات المرسلة
        console.log("بيانات الإرسال إلى الخادم:", {
            endpoint: "https://speech-correction-api.azurewebsites.net/api/Test/store-issues",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: issuesData
        });

        try {
            const response = await fetch(
                'https://speech-correction-api.azurewebsites.net/api/Test/store-issues',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(issuesData)
                }
            );

            // لوج الاستجابة الخام من الخادم
            console.log("استجابة الخادم الخام:", response);

            if (!response.ok) {
                throw new Error('فشل في حفظ البيانات');
            }

            const result = await response.json();
            
            // لوج البيانات المستلمة من الخادم
            console.log("بيانات الاستجابة من الخادم:", result);
            
            return true;
        } catch (error) {
            console.error('حدث خطأ أثناء إرسال البيانات:', error);
            return false;
        }
    };

    const handleStartTraining = async () => {
        console.log("بدء عملية التدريب...");
        
        if (!token) {
            console.error("لا يوجد توكن، يرجى تسجيل الدخول أولاً");
            return;
        }
        
        // إرسال البيانات أولاً
        const success = await storeSelectedLetters();
        
        if (success) {
            console.log("تم حفظ البيانات بنجاح، الانتقال إلى لوحة التحكم");
        } else {
            console.log("حدثت مشكلة في حفظ البيانات، ولكن سيتم الانتقال إلى لوحة التحكم");
        }
        
        // الانتقال للصفحة التالية
        // navigate("/dashboard");
    };

    const handleQuickTest = () => {
        console.log("الانتقال إلى صفحة الاختبار السريع");
        navigate("/TestPage");
    };

    return (
        <Box
            dir="rtl"
            sx={{
                minHeight: "100vh",
                backgroundImage: `url(${backgroundPattern})`,
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
                py: 4,
                fontFamily: "Kidzhood Arabic",
                position: "relative",
                
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        borderRadius: 4,
                        border: "2px solid #00bcd4",
                        textAlign: "center",
                        backgroundColor: "#fff",
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        fontWeight="bold"
                        sx={{ fontFamily: "RTL Mocha Yemen Sadah" }}
                    >
                        اختر الحروف اللي عايز تتدرب عليها:
                    </Typography>

                    <Grid container spacing={1} justifyContent="center">
                        {arabicLetters.map((letter, idx) => (
                            <Grid
                                item
                                xs={3}
                                key={idx}
                                display="flex"
                                justifyContent="center"
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    sx={{
                                        width: "100%",
                                        height: 40,
                                        px: 1,
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedLetters.includes(letter)}
                                        onChange={() => handleLetterToggle(letter)}
                                        sx={{
                                            color: "#00bcd4",
                                            "&.Mui-checked": {
                                                color: "#FCA43C",
                                            },
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            fontFamily: "Kidzhood Arabic",
                                            fontSize: "1rem"
                                        }}
                                    >
                                        {letter}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={trainAll}
                                onChange={handleTrainAllChange}
                                sx={{
                                    color: "#00bcd4",
                                    "&.Mui-checked": {
                                        color: "#FCA43C",
                                    },
                                    fontFamily: "Kidzhood Arabic",
                                }}
                            />
                        }
                        label="تدرب على كل الحروف"
                        sx={{
                            mt: 2,
                            fontFamily: "Kidzhood Arabic !important",
                            fontSize: "1.1rem",
                            "& .MuiFormControlLabel-label": {
                                fontFamily: "Kidzhood Arabic !important",
                                fontSize: "inherit"
                            }
                        }}
                    />
                </Paper>

                <Typography align="center" my={2} sx={{
                    fontFamily: "Kidzhood Arabic",
                    fontSize: "1.3rem"
                }}>
                    ــــــــــ أو ــــــــــ
                </Typography>

                <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleQuickTest}
                    sx={{
                        borderRadius: 4,
                        borderColor: "#00bcd4",
                        color: "#00bcd4",
                        backgroundColor: "white",
                        fontFamily: "Kidzhood Arabic !important",
                        fontSize: "1.3rem",
                        py: 1.5,
                        mb: 3,
                        "&:hover": {
                            backgroundColor: "white",
                            borderColor: "#00bcd4",
                            boxShadow: "0px 2px 4px rgba(0, 188, 212, 0.3)"
                        }
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <ArrowForwardIcon sx={{ fontSize: "1.5rem", ml: 2 }} />
                        <span style={{ margin: "0 12px" }}>اختبار سريع لمعرفه الحروف</span>
                        <ListAltIcon sx={{ fontSize: "1.5rem", mr: 2 }} />
                    </Box>
                </Button>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleStartTraining}
                    sx={{
                        borderRadius: 5,
                        fontWeight: "bold",
                        backgroundColor: "#00bcd4",
                        "&:hover": {
                            backgroundColor: "#FCA43C",
                        }, fontFamily: "RTL Mocha Yemen Sadah",
                        fontSize: "1.3rem",
                        py: 1.5,
                        mb: 3,
                    }}
                >
                    يلا نبدأ التدريب
                </Button>
            </Container>
        </Box >
    );
};

export default LetterTrainingPage;