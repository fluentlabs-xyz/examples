import { Box, Button } from "@mui/material"
import { styled } from "@mui/material/styles"

export const ButtonsContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginTop: 6,
  width: "100%",
}))

export const SolutionBtn = styled(Button)(({ theme }) => ({
  width: "100%",
  textWrap: "nowrap",
  border: `1px solid ${theme.palette.primary.main}`,
}))

export const NewGameBtn = styled(Button)(({ theme }) => ({
  background: "white",
  width: "100%",
  color: "black",
  border: `1px solid ${theme.palette.primary.light}`,
}))
