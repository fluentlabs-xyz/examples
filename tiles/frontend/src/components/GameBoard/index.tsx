import { useCallback, useContext, useEffect, useRef } from "react"

import { useAccount } from "wagmi"

import {
  Board,
  Grid,
  GridCell,
  Tiles,
} from "@/components/GameBoard/styles/styles.ts"
import { useCurrentNetworkStatus } from "@/shared/hooks/useCurrentNetworkStatus.ts"

import { GameContext } from "./context/game-context"
import { LOCAL_STORAGE_KEY } from "./context/reducers/game-reducer"
import MobileSwiper from "./mobile-swiper"
import type { SwipeInput } from "./mobile-swiper"
import type { Tile as TileModel } from "./models/tile"
import Splash from "./splash"
import Tile from "./tile"

export default function GameBoard() {
  const { getTiles, moveTiles, startGame, newGame, status,  } =
    useContext(GameContext)
  const initialized = useRef(false)
  const { isConnected } = useAccount()
  const { isWrongNetwork } = useCurrentNetworkStatus()
  const showBoard = isConnected && !isWrongNetwork

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault()
      if (status === "won" || status === "lost") {
        return
      }
      switch (e.code) {
        case "ArrowUp":
          moveTiles("move_up")
          break
        case "ArrowDown":
          moveTiles("move_down")
          break
        case "ArrowLeft":
          moveTiles("move_left")
          break
        case "ArrowRight":
          moveTiles("move_right")
          break
        default:
          moveTiles("move_up")
          break
      }
    },
    [moveTiles],
  )

  const handleSwipe = useCallback(
    ({ deltaX, deltaY }: SwipeInput) => {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          moveTiles("move_right")
        } else {
          moveTiles("move_left")
        }
      } else if (deltaY > 0) {
        moveTiles("move_down")
      } else {
        moveTiles("move_up")
      }
    },
    [moveTiles],
  )

  const renderGrid = () => {
    const cells: JSX.Element[] = []
    const totalCellsCount = 16
    for (let index = 0; index < totalCellsCount; index += 1) {
      cells.push(<GridCell key={index} />)
    }
    return cells
  }

  const renderTiles = () =>
    getTiles().map((tile: TileModel) => {
      if (!tile) return null
      return <Tile key={`${tile.id}`} {...tile} />
    })

  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (initialized.current === false) {
      if (savedState) {
        startGame()
      } else {
        newGame()
      }
      initialized.current = true
    }
  }, [newGame, startGame])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <MobileSwiper onSwipe={handleSwipe}>
      <Board hide={!isConnected}>
        {!isConnected && <Splash heading="Connect wallet" type="wallet" />}
        {status === "won" && showBoard && <Splash heading="You Win!" />}
        {status === "lost" && showBoard && <Splash heading="Game Over!" />}
        {isConnected && <Tiles>{renderTiles()}</Tiles>}
        {isConnected && <Grid>{renderGrid()}</Grid>}
      </Board>
    </MobileSwiper>
  )
}
