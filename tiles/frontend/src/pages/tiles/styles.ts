import { Box, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

export const Container = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "0 auto",
  maxWidth: "874px",
  width: "100%",
  marginTop: 52,
  marginBottom: 62,
  gap: 62,
}))

export const WhiteCard = styled(Box)(() => ({
  backgroundColor: "#fff",
  width: "100%",
  borderRadius: "24px",
  display: "flex",
  padding: "40px",
  flexDirection: "column",
  justifyItems: "center",
  alignItems: "center",
}))

export const Instructions = styled(Box)(() => ({
  gap: 32,
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  alignItems: "center",
  width: "100%",
}))

export const Instruction = styled(Box)(() => ({
  gap: 32,
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
}))

export const InstructionName = styled(Typography)(() => ({
  fontSize: 20,
  textTransform: "uppercase",
  textWrap: "nowrap",
  fontWeight: 700,
}))

export const InstructionDescription = styled(Typography)(() => ({
  fontSize: 16,
  fontWeight: 400,
  width: 600,
}))

export const CreatedBy = styled(Typography)(() => ({
  margin: "-32px 100px 0",
  fontSize: 16,
  textAlign: "center",
  fontWeight: 400,
  width: 600,
  "& a": {
    textDecoration: "underline",
  },
}))
