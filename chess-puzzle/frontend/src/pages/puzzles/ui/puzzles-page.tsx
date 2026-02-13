import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Button as MuiButton,
} from "@mui/material"
import { useAccount, useConnect } from "wagmi"

import { useNavigateWithConnectionStatus } from "@/shared/hooks"

export default function PuzzlesPage() {
  const account = useAccount()
  const theme = useTheme()
  const { connectors, connectAsync, error } = useConnect()
  useNavigateWithConnectionStatus()
  const tablet = useMediaQuery(theme.breakpoints.down("sm"))

  const handleConnectClick = async () => {
    const connector = connectors.find((c) => c.name === "MetaMask")

    if (connector) {
      await connectAsync({ connector })
    }
  }

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        ":after": {
          content: "''",
          position: "absolute",
          backgroundColor: "#F2F2F2",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(/bg.png)",
          opacity: 0.2,
          zIndex: -1,
          transition: "opacity 0.5s ease-in-out, filter 0.5s ease-in-out",
          willChange: "opacity, filter",
          transform: "scale(1.1)",
          transformOrigin: "center",
          transformStyle: "preserve-3d",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          width: "90%",
          maxWidth: "1144px",
          minHeight: "75vh",
          borderRadius: "24px",
          margin: "0 auto",
          display: "flex",
          padding: "60px",
          flexDirection: "column",
          gap: "42px",
          textAlign: "center",
        }}
      >
        <img
          src="/ChessImage.svg"
          style={{ maxWidth: 300, width: "inherit", margin: "auto" }}
          alt="chess-image"
        />
        <div>
          <Typography
            style={{
              fontSize: "28px",
              fontWeight: "600",
              letterSpacing: "0.28px",
            }}
          >
            Chess puzzle
          </Typography>

          <Typography
            style={{
              color: "#666",
              fontSize: "18px",
              fontWeight: "400",
              letterSpacing: "0.28px",
            }}
          >
            Connect wallet to unlock chess puzzels
          </Typography>
        </div>

        <Box
          sx={() => ({
            gap: "24px",
            display: "flex",
            [theme.breakpoints.down("md")]: {
              flexDirection: "column",
            },
          })}
        >
          <MuiButton
            sx={{ flex: 1 }}
            onClick={() =>
              window.open("https://testnet.fluent.xyz/dev-portal", "_blank")
            }
            color="secondary"
            variant="contained"
            size={tablet ? "medium" : "large"}
          >
            GET TEST ETH
          </MuiButton>

          <MuiButton
            sx={{ flex: 1 }}
            variant="contained"
            size={tablet ? "medium" : "large"}
            disabled={
              account.status === "connected" ||
              account.status === "reconnecting"
            }
            onClick={handleConnectClick}
          >
            CONNECT WALLET
          </MuiButton>
        </Box>

        {error && (
          <Typography
            variant="h6"
            className="message"
            sx={{ color: "#38C9FF", fontSize: 22, mt: "12px" }}
          >
            {error.message}
          </Typography>
        )}
        <Typography
          sx={{
            color: "#A7A7A7",
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "0.16px",
          }}
        >
          Deployed on the Fluent Developer Preview
        </Typography>
      </Box>
    </Box>
  )
}
