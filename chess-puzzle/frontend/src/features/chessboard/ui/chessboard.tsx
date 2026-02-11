import { useCallback, useEffect, useRef, useState } from "react"

import { Box, Typography } from "@mui/material"
import { Chess } from "chess.js"
import { Chessground } from "chessground"
import type { Api } from "chessground/api"

import "./chessground.base.css"
import "./chessground.brown.css"
import "./chessground.cburnett.css"
import { SQUARES } from "@/shared/config/consts.ts"
import { useSolvePuzzle } from "@/shared/hooks/useSolvePuzzle"

const toDests = (chess: any) => {
  const dests = new Map()
  SQUARES.forEach((square) => {
    const moves = chess.moves({ square, verbose: true })
    if (moves.length) {
      dests.set(
        square,
        moves.map((move: any) => move.to),
      )
    }
  })
  return dests
}

function cleanMove(move: string) {
  return move.replace("+", "").replace("#", "")
}

const Chessboard = ({
  puzzleFen,
  chessPuzzleAddress,
}: {
  puzzleFen: string
  chessPuzzleAddress: `0x${string}`
}) => {
  const { mutateAsync: solvePuzzle, isPending: isSubmitting } =
    useSolvePuzzle(chessPuzzleAddress)
  const [chess, setChess] = useState(new Chess(puzzleFen))
  const [shouldUndo, setShouldUndo] = useState(false)
  const [message, setMessage] = useState("")
  const [, setIsSolved] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const chessgroundRef = useRef<Api | null>(null)

  const submitSolution = async (move: string) => {
    if (isSubmitting) {
      return
    }

    setMessage("Looks like you solved the puzzle! Submitting...")
    try {
      const receipt = await solvePuzzle({
        fen: puzzleFen,
        move,
      })

      if (receipt) {
        setMessage("Puzzle solved! Check your wallet.")
      } else {
        setMessage("Transaction failed.")
      }
    } catch (error) {
      setMessage("Error submitting solution.")
      console.error(error)
    }
  }

  const handleMove = useCallback(
    async (_: Api, from: string, to: string) => {
      const move = chess.move({ from, to })
      if (move) {
        if (chess.isCheckmate()) {
          console.log("Checkmate")
          setMessage("Submitting solution...")
          await submitSolution(cleanMove(move.san))
          setIsSolved(true)
        } else {
          console.log("Not checkmate")
          setMessage("Not a checkmate. Try again.")
          setShouldUndo(true)

          setTimeout(() => {
            chess.undo()
            setShouldUndo(false)
            setChess(new Chess(chess.fen()))
          }, 500)
        }
      } else {
        console.log("Invalid move")
      }
    },
    [chess, submitSolution],
  )

  useEffect(() => {
    setChess(new Chess(puzzleFen))
    setMessage("Try to solve the puzzle in one move")
  }, [puzzleFen])

  useEffect(() => {
    if (containerRef.current) {
      const chessground = Chessground(containerRef.current, {
        fen: chess.fen(),
        turnColor: chess.turn() === "w" ? "white" : "black",
        movable: {
          color: "both",
          free: false,
          dests: toDests(chess),
          events: {
            after: (from, to) => handleMove(chessground, from, to),
          },
        },
        highlight: {
          lastMove: true,
          check: true,
        },
        animation: {
          enabled: true,
          duration: 500,
        },
      })

      chessgroundRef.current = chessground

      return () => {
        chessground.destroy()
      }
    }
  }, [chess, handleMove])

  useEffect(() => {
    if (shouldUndo && chessgroundRef.current) {
      chessgroundRef.current.set({
        fen: chess.fen(),
        turnColor: chess.turn() === "w" ? "white" : "black",
        movable: {
          color: "both",
          free: false,
          dests: toDests(chess),
        },
        animation: {
          enabled: true,
          duration: 200,
        },
      })
    }
  }, [chess, shouldUndo])

  return (
    <Box sx={{ zIndex: 100 }}>
      {message && (
        <Box sx={{ pb: "32px" }}>
          <Typography
            variant="h6"
            sx={(theme) => ({
              fontSize: "28px",
              fontWeight: 600,
              letterSpacing: "0.28px",
              [theme.breakpoints.down("sm")]: {
                fontSize: "16px",
              },
            })}
          >
            {message}
          </Typography>
        </Box>
      )}
      <Box ref={containerRef} sx={{ width: 400, height: 400 }} />
    </Box>
  )
}

export default Chessboard
