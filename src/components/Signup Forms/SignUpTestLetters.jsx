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
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";

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

    const handleStartTraining = () => {
        navigate("/dashboard");
    };
    return (
        <Box
            dir="rtl"
            sx={{
                minHeight: "100vh",
                backgroundImage: "url('/bg-pattern.png')", // استبدل باسم صورتك أو خليها لون فقط
                backgroundSize: "cover",
                py: 4,
                fontFamily: "Kidzhood Arabic", // الخط العام
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
                        sx={{ fontFamily: "RTL Mocha Yemen Sadah" }} // عنوان بخط مختلف
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
                                            fontSize: "1rem" // ← تقدر تصغر أكتر لو حبيت مثلا 1rem
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
                                    fontFamily: "Kidzhood Arabic", // هذا للـ Checkbox نفسه
                                }}
                            />
                        }
                        label="تدرب على كل الحروف"
                        sx={{
                            mt: 2,
                            fontFamily: "Kidzhood Arabic !important", // هذا للنص
                            fontSize: "1.1rem", // حجم الخط للنص
                            "& .MuiFormControlLabel-label": { // تأكيد التطبيق على النص
                                fontFamily: "Kidzhood Arabic !important",
                                fontSize: "inherit" // يرث حجم الخط من العنصر الأب
                            }
                        }}
                    />
                </Paper>

                <Typography align="center" my={2} sx={{
                    fontFamily: "Kidzhood Arabic",
                    fontSize: "1.3rem" // ← تقدر تصغر أكتر لو حبيت مثلا 1rem
                }}>
                    ــــــــــ أو ــــــــــ
                </Typography>

                <Button
                    variant="outlined"
                    fullWidth
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
