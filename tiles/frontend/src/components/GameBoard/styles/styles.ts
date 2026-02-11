import { Box, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

export const Board = styled(Box)<{ hide: boolean }>(
  ({ theme, hide }) => ({
    width: 400,
    height: 400,
    padding: 12,
    background: hide ? "#FFF" : `${theme.palette.primary.main}80`,
    borderRadius: 16,
    position: "relative",
  }),
)

export const Tiles = styled(Box)(() => ({
  position: "absolute",
  zIndex: 2,
  margin: 20,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
}))

export const TileCell = styled(Box)(() => ({
  position: "absolute",
  zIndex: 2,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: "78px",
  height: "78px",
  borderRadius: "4px",
  transitionProperty: "left, top, transform",
  transitionDuration: "200ms, 200ms, 100ms",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#EBE9FF",
}))

export const TileCellText = styled(Box)(() => ({
  fontSize: 24,
  fontWeight: 800,
  textTransform: "capitalize",
}))

export const Grid = styled(Box)(() => ({
  display: "flex",
  flexWrap: "wrap",
}))

export const GridCell = styled(Box)(() => ({
  width: "78px",
  height: "78px",
  margin: "8px",
  borderRadius: "4px",
  backgroundColor: "#EBE9FF70",
}))

export const SplashContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  borderRadius: 16,
  backgroundColor: "#EBE9FF70",
  position: "absolute",
  zIndex: 3,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  background: `rgba(255, 255, 255, 0.6)`,
}))

export const SplashText = styled(Typography)(() => ({
  fontSize: 50,
  fontWeight: 800,
  color: "",
}))
