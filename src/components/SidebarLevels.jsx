import React from "react";
import { Card, CardContent, Typography, Box, Stack, IconButton } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const levelsData = [
  {
    title: "المستوى الأول",
    description: "هتتعلم نطق الكلمات صح عن طريق السمع والتكرار.",
    unlocked: true,
    color: "#FFA726", // برتقالي
  },
  {
    title: "المستوى الثاني",
    description: "هتتدرب على نطق جمل بسيطة وسهلة.",
    unlocked: false,
    color: "#BDBDBD", // رمادي
  },
  {
    title: "المستوى الثالث",
    description: "هتتحدى نفسك وتنطق جمل أطول وأصعب.",
    unlocked: false,
    color: "#BDBDBD",
  },
];

const SidebarLevels = () => {
  return (
    <Box sx={{ p: 2, backgroundColor: "#F5F5F5", height: "100vh", width: 300 }}>
      <Stack spacing={2}>
        {levelsData.map((level, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: level.color,
              color: "#fff",
              position: "relative",
              borderRadius: "16px",
              boxShadow: 3,
              opacity: level.unlocked ? 1 : 0.7,
              transition: "0.3s",
              cursor: level.unlocked ? "pointer" : "default",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {level.title}
              </Typography>
              <Typography variant="body2" mt={1}>
                {level.description}
              </Typography>
              {!level.unlocked && (
                <LockIcon
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    color: "#fff",
                    opacity: 0.9,
                  }}
                />
              )}
              {level.unlocked && (
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    color: "#fff",
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default SidebarLevels;
