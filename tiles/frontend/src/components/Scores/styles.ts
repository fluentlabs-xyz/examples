import { Box, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

export const ScoresLayout = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
}))

export const ScoreItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: "6px 36px",
  background: theme.palette.secondary.main,
  borderRadius: 6,
}))

export const ScoreName = styled(Typography)(() => ({
  fontSize: 16,
  textTransform: "uppercase",
}))

export const ScoreValue = styled(Typography)(() => ({
  fontSize: 24,
  textTransform: "uppercase",
  fontWeight: 800,
}))
