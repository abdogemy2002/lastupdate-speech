import React from 'react';

import { Box, Typography, Grid, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import CountUp from "react-countup";
import { FaChild, FaUserMd, FaCheckCircle, FaSmile } from "react-icons/fa";

const StatisticsSection = () => {
    const stats = [
        {
            number: 12,
            title: "طفل من كل 100 يعاني من اضطراب نطق",
            icon: <FaChild size={40} />,
            color: "#20B2AA"
        },
        {
            number: 150,
            title: "أخصائي نطق مستهدف لاستخدام المنصة",
            icon: <FaUserMd size={40} />,
            color: "#FCA43C"
        },
        {
            number: 89,
            title: "نسبة استجابة للعلاج عند الانتظام",
            icon: <FaCheckCircle size={40} />,
            color: "#20B2AA"
        },
        {
            number: 300,
            title: "تدريب تفاعلي متوقع داخل البرنامج",
            icon: <FaSmile size={40} />,
            color: "#FCA43C"
        }
    ];



    const StatCard = styled(Box)(({ theme, color }) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(4),
        textAlign: "center",
        boxShadow: theme.shadows[4],
        transition: "transform 0.3s, box-shadow 0.3s",
        borderBottom: `4px solid ${color}`,
        "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: theme.shadows[8]
        }
    }));

    return (
        <Box
            sx={{
                py: 10,
                backgroundColor: "#f8f9fa",
                backgroundImage: "radial-gradient(circle at 10% 20%, rgba(78, 84, 200, 0.1) 0%, rgba(78, 84, 200, 0.05) 90%)",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* تأثيرات زخرفية */}
            <Box sx={{
                position: "absolute",
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: "50%",
                backgroundColor: "rgba(32, 178, 170, 0.1)",
                zIndex: 0
            }} />

            <Box sx={{
                position: "absolute",
                bottom: -50,
                left: -50,
                width: 200,
                height: 200,
                borderRadius: "50%",
                backgroundColor: "rgba(252, 164, 60, 0.1)",
                zIndex: 0
            }} />

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                    variant="h3"
                    align="center"
                    gutterBottom
                    sx={{
                        fontWeight: "bold",
                        mb: 6,
                        background: "linear-gradient(90deg, #20B2AA, #20B2AA)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}
                >
                    أرقامنا تتحدث عنا
                </Typography>

                <Typography
                    variant="h6"
                    align="center"
                    color="text.secondary"
                    sx={{ mb: 8, fontSize: "1.25rem" }}
                >
                    إنجازاتنا خلال رحلة علاج مشاكل النطق
                </Typography>

                <Grid container spacing={4}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <StatCard color={stat.color}>
                                <Box sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    backgroundColor: `${stat.color}20`,
                                    color: stat.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 20px"
                                }}>
                                    {stat.icon}
                                </Box>

                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: "bold",
                                        mb: 2,
                                        color: stat.color
                                    }}
                                >
                                    <CountUp end={stat.number} duration={3} />+
                                </Typography>

                                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                                    {stat.title}
                                </Typography>
                            </StatCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default StatisticsSection;