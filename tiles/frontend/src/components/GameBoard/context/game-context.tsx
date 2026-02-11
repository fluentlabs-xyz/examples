import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react"

import { isNil, throttle } from "lodash"

import gameReducer, {
  initState,
  LOCAL_STORAGE_KEY,
} from "@/components/GameBoard/context/reducers/game-reducer"

import {
  gameWinTileValue,
  mergeAnimationDuration,
  tileCountPerDimension,
} from "../constants"
import type { Tile } from "../models/tile"

type MoveDirection = "move_up" | "move_down" | "move_left" | "move_right"

type ContextType = {
  score: number
  bestScore: number
  status: string
  moves: (0 | 1 | 2 | 3)[]
  seed: bigint
  moveTiles: (_: MoveDirection) => void
  getTiles: () => Tile[]
  startGame: () => void
  newGame: () => void
}

export const GameContext = createContext<ContextType>({
  score: 0,
  bestScore: 0,
  status: "ongoing",
  moves: [],
  seed: 0n,
  moveTiles: (_: MoveDirection) => {},
  getTiles: () => [],
  startGame: () => {},
  newGame: () => {},
})

export default function GameProvider({ children }: PropsWithChildren) {
  const [gameState, dispatch] = useReducer(gameReducer, initState())

  const getEmptyCells = () => {
    const results: [number, number][] = []

    for (let x = 0; x < tileCountPerDimension; x++) {
      for (let y = 0; y < tileCountPerDimension; y++) {
        if (isNil(gameState.board[y][x])) {
          results.push([x, y])
        }
      }
    }
    return results
  }

  const randomAvailableCell = () => {
    const rng = gameState.range
    const randomNum = rng.random()
    const cells = getEmptyCells()

    if (cells.length) {
      return cells[Math.floor(randomNum * cells.length)]
    }
  }

  const appendRandomTile = () => {
    const emptyCells = getEmptyCells()
    const rng = gameState.range
    const value = rng.random() < 0.9 ? 2 : 4
    const randomCell = randomAvailableCell()
    if (emptyCells.length > 0 && randomCell) {
      const newTile = {
        position: randomCell,
        value,
      }
      dispatch({ type: "create_tile", tile: newTile })
    }
  }

  const getTiles = () =>
    gameState.tilesByIds.map((tileId) => gameState.tiles[tileId])

  const moveTiles = useCallback(
    throttle(
      (type: MoveDirection) => dispatch({ type }),
      mergeAnimationDuration * 1.05,
      { trailing: false },
    ),
    [dispatch],
  )

  const startGame = async () => {
    dispatch({ type: "reset_game" })
  }

  const newGame = async () => {
    dispatch({ type: "new_game" })
  }

  const checkGameState = () => {
    const isWon =
      Object.values(gameState.tiles).filter((t) => t.value === gameWinTileValue)
        .length > 0

    if (isWon) {
      dispatch({ type: "update_status", status: "won" })
      return
    }

    const { tiles, board } = gameState

    const maxIndex = tileCountPerDimension - 1
    for (let x = 0; x < maxIndex; x += 1) {
      for (let y = 0; y < maxIndex; y += 1) {
        if (
          isNil(gameState.board[x][y]) ||
          isNil(gameState.board[x + 1][y]) ||
          isNil(gameState.board[x][y + 1])
        ) {
          return
        }

        if (tiles[board[x][y]].value === tiles[board[x + 1][y]].value) {
          return
        }

        if (tiles[board[x][y]].value === tiles[board[x][y + 1]].value) {
          return
        }
      }
    }

    dispatch({ type: "update_status", status: "lost" })
  }

  useEffect(() => {
    if (gameState.hasChanged) {
      setTimeout(() => {
        dispatch({ type: "clean_up" })
        appendRandomTile()
      }, mergeAnimationDuration)
    }
  }, [gameState.hasChanged])

  useEffect(() => {
    if (!gameState.hasChanged) {
      checkGameState()
    }
  }, [gameState.hasChanged])

  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY)
    const savedBestScore = savedState ? JSON.parse(savedState).bestScore : 0
    const stateToSave = {
      ...gameState,
      bestScore: Math.max(gameState.score, savedBestScore || 0),
      seed: gameState.seed.toString(),
      range: "",
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave))
  }, [gameState])

  const contextValue = useMemo(
    () => ({
      score: gameState.score,
      bestScore: gameState.bestScore || 0,
      status: gameState.status,
      moves: gameState.moves,
      seed: gameState.seed,
      getTiles,
      moveTiles,
      startGame,
      newGame,
    }),
    [],
  )

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  )
}
