import { Box } from "@mui/material"
import { styled } from "@mui/material/styles"

export const Container = styled(Box)(() => ({
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  alignItems: "center",
  margin: "0 auto",
}))
