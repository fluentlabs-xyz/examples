import { Box, Typography } from "@mui/material"

const Header = () => (
  <Box
    sx={{
      textAlign: "center",
    }}
  >
    <Typography
      variant="body2"
      sx={(theme) => ({
        opacity: 0.8,
        fontSize: "18px",
        letterSpacing: "0.18px",
        [theme.breakpoints.down("sm")]: {
          fontSize: "14px",
        },
      })}
    >
      Deployed on the Fluent Developer Preview
    </Typography>
  </Box>
)

export default Header
