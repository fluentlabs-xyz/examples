import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"

import { Header } from "@/components/Header"

export const Layout = () => (
  <Box
    sx={{
      paddingTop: "64px",
      height: "100vh",
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#F2F2F2",
      boxSizing: "border-box",
    }}
  >
    <Header />
    <main style={{ height: "100%", display: "flex", overflowY: "auto" }}>
      <Outlet />
    </main>
  </Box>
)
