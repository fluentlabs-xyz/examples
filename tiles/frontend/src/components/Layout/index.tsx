import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"

import { Header } from "@/components/Header"

export const Layout = () => (
  <Box
    sx={{
      paddingTop: "64px",
      backgroundColor: "#F2F2F2",
      boxSizing: "border-box",
    }}
  >
    <Header />
    <main style={{ height: "100%", display: "flex", margin: "0 260px" }}>
      <Outlet />
    </main>
  </Box>
)
