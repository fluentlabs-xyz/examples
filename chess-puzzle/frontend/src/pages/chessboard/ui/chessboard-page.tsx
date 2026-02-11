import { useEffect, useState } from "react"

import { Box, Typography, CircularProgress, Button } from "@mui/material"
import { useSearchParams } from "react-router-dom"
import { formatUnits } from "viem"

import Chessboard from "@/features/chessboard/ui/chessboard"
import { DEFAULT_CONTRACT_ADDRESS } from "@/shared/config/consts"
import { useNavigateWithConnectionStatus } from "@/shared/hooks"
import { useGetRandomUnresolvedPuzzle } from "@/shared/hooks/useGetRandomUnresolvedPuzzle.ts"
import Header from "@/widget/header"

function ChessboardPage() {
  const [searchParams] = useSearchParams()
  const chessPuzzleAddress =
    (searchParams.get("contract") as `0x${string}`) ||
    (DEFAULT_CONTRACT_ADDRESS as `0x${string}`)

  const {
    data: puzzle,
    error,
    isLoading,
  } = useGetRandomUnresolvedPuzzle(chessPuzzleAddress)
  const [message, setMessage] = useState("")
  useNavigateWithConnectionStatus()

  useEffect(() => {
    if (error) {
      setMessage(error.message)
    }
  }, [error])

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#fff",
        width: "90%",
        maxWidth: "874px",
        minHeight: "75vh",
        borderRadius: "24px",
        margin: "auto",
        display: "flex",
        padding: "40px",
        flexDirection: "column",
        gap: "42px",
        textAlign: "center",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "90%",
          borderRadius: "20px",
          margin: "0 auto",
        }}
      >
        <Header />

        {message && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            {message}
          </Typography>
        )}

        {!puzzle || !puzzle.isActive ? (
          <Typography variant="h5" sx={{ mb: 2 }}>
            Puzzle is not found in the contract (probably it solved already)
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Chessboard
                puzzleFen={puzzle.fen}
                chessPuzzleAddress={chessPuzzleAddress}
              />
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontSize: 20,
                  lineHeight: "27px",
                  letterSpacing: "0.2px",
                }}
                variant="body1"
              >
                Reward:{" "}
                <strong
                  style={{
                    fontWeight: 600,
                    fontSize: 24,
                    letterSpacing: "0.24px",
                    lineHeight: "24px",
                  }}
                >
                  {formatUnits(puzzle.reward, puzzle.token.decimals)} (
                  {puzzle.token.symbol})
                </strong>
              </Typography>
            </Box>
          </>
        )}
      </Box>
      <Button
        sx={{ width: 200 }}
        variant="contained"
        color="secondary"
        onClick={() =>
          window.open("https://testnet.fluent.xyz/dev-portal", "_blank")
        }
      >
        Get Test ETH
      </Button>
    </Box>
  )
}

export default ChessboardPage
