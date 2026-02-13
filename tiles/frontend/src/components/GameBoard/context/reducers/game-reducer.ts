import { flattenDeep, isEqual, isNil } from "lodash"
import { uid } from "uid"

import { tileCountPerDimension } from "../../constants";
import type { Tile, TileMap } from "../../models/tile";

type GameStatus = "ongoing" | "won" | "lost"
export const LOCAL_STORAGE_KEY = "gameState"

export class Xorshift128Plus {
  s0: bigint

  s1: bigint

  constructor(seed: bigint) {
    this.s0 = (seed << 1n) & BigInt("0xFFFFFFFFFFFFFFFF")
    this.s1 = (seed >> 1n) & BigInt("0xFFFFFFFFFFFFFFFF")
  }

  next(): bigint {
    let s1 = this.s0
    const s0 = this.s1
    this.s0 = s0

    s1 = (s1 ^ (s1 << 23n)) & BigInt("0xFFFFFFFFFFFFFFFF")
    s1 = (s1 ^ (s1 >> 17n)) & BigInt("0xFFFFFFFFFFFFFFFF")
    s1 = (s1 ^ s0 ^ (s0 >> 26n)) & BigInt("0xFFFFFFFFFFFFFFFF")
    this.s1 = s1

    const result = (this.s1 + s0) & BigInt("0xFFFFFFFFFFFFFFFF")
    return result
  }

  random(): number {
    const maxUint64 = BigInt("0xFFFFFFFFFFFFFFFF")
    return Number(this.next()) / Number(maxUint64)
  }

  serialize(): { s0: string; s1: string } {
    return { s0: this.s0.toString(), s1: this.s1.toString() }
  }
}

function generateU64Seed(): bigint {
  const maxU64 = BigInt("0xFFFFFFFFFFFFFFFF")
  const randomBigInt =
    (BigInt(Math.floor(Math.random() * Number(maxU64 >> BigInt(32)))) <<
      BigInt(32)) |
    BigInt(Math.floor(Math.random() * Number(maxU64 >> BigInt(32))))
  return randomBigInt
}

export type State = {
  board: string[][]
  tiles: TileMap
  tilesByIds: string[]
  hasChanged: boolean
  score: number
  bestScore: number
  status: GameStatus
  moves: (1 | 2 | 3 | 0)[]
  seed: bigint
  range: Xorshift128Plus
}
type Action =
  | { type: "create_tile"; tile: Tile }
  | { type: "clean_up" }
  | { type: "move_up" }
  | { type: "move_down" }
  | { type: "move_left" }
  | { type: "move_right" }
  | { type: "reset_game" }
  | { type: "new_game" }
  | { type: "update_status"; status: GameStatus }

function createBoard() {
  const board: string[][] = []
  for (let i = 0; i < tileCountPerDimension; i += 1) {
    board[i] = new Array(tileCountPerDimension).fill(undefined)
  }
  return board
}

const generateSeedAndRange = () => {
  const seed = generateU64Seed()
  const range = new Xorshift128Plus(seed)

  return {
    seed,
    range,
  }
}

export const createNewState = (): State => {
  const savedState = localStorage.getItem(LOCAL_STORAGE_KEY)
  const savedBestScore = savedState ? JSON.parse(savedState).bestScore : 0

  return {
    board: createBoard(),
    tiles: {},
    tilesByIds: [],
    hasChanged: false,
    score: 0,
    bestScore: savedBestScore,
    status: "ongoing",
    moves: [],
    ...generateSeedAndRange(),
  }
}

export const loadStateFromLocalStorage = () => {
  const savedState = localStorage.getItem(LOCAL_STORAGE_KEY)
  return savedState ? (JSON.parse(savedState) as State) : createNewState()
}

export const initState = (): State => {
  const state = loadStateFromLocalStorage()
  const seed = BigInt(state.seed)
  const range = new Xorshift128Plus(seed)

  return {
    ...state,
    seed,
    range,
  }
}

export const getEmptyCells = (gameState: State) => {
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

export const randomAvailableCell = (gameState: State) => {
  const rng = gameState.range
  const cellRnd = rng.next()
  const cells = getEmptyCells(gameState)

  if (cells.length) {
    const index = Number((cellRnd * BigInt(cells.length)) >> 64n)
    return cells[index]
  }
}

export default function gameReducer(state: State, action: Action): State {
  switch (action.type) {
    case "clean_up": {
      const flattenBoard = flattenDeep(state.board)
      const newTiles: TileMap = flattenBoard.reduce(
        (result, tileId: string) => {
          if (isNil(tileId)) {
            return result
          }
          return {
            ...result,
            [tileId]: state.tiles[tileId],
          }
        },
        {},
      )

      return {
        ...state,
        tiles: newTiles,
        tilesByIds: Object.keys(newTiles),
        hasChanged: false,
      }
    }
    case "create_tile": {
      const [x, y] = action.tile.position
      const tileId = uid()
      const newBoard = JSON.parse(JSON.stringify(state.board))
      newBoard[y][x] = tileId

      return {
        ...state,
        board: newBoard,
        tiles: {
          ...state.tiles,
          [tileId]: {
            id: tileId,
            ...action.tile,
          },
        },
        tilesByIds: [...state.tilesByIds, tileId],
      }
    }
    case "move_up": {
      const newBoard = createBoard()
      const newTiles: TileMap = {}
      let hasChanged = false
      const { moves } = state
      let { score } = state

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = 0
        let previousTile: Tile | undefined
        for (let y = 0; y < tileCountPerDimension; y++) {
          const tileId = state.board[y][x]
          const currentTile = state.tiles[tileId]
          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              score += previousTile.value * 2
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              }
              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY - 1],
              }
              previousTile = undefined
              hasChanged = true
              continue
            }
            newBoard[newY][x] = tileId
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            }
            previousTile = newTiles[tileId]
            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true
            }
            newY++
          }
        }
      }
      const bestScore = Math.max(state.bestScore, score)
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
        bestScore,
        moves: [...moves, 0],
      }
    }
    case "move_down": {
      const newBoard = createBoard()
      const newTiles: TileMap = {}
      let hasChanged = false
      const { moves } = state
      let { score } = state

      for (let x = 0; x < tileCountPerDimension; x++) {
        let newY = tileCountPerDimension - 1
        let previousTile: Tile | undefined
        for (let y = tileCountPerDimension - 1; y >= 0; y--) {
          const tileId = state.board[y][x]
          const currentTile = state.tiles[tileId]
          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              score += previousTile.value * 2
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              }
              newTiles[tileId] = {
                ...currentTile,
                position: [x, newY + 1],
              }
              previousTile = undefined
              hasChanged = true
              continue
            }
            newBoard[newY][x] = tileId
            newTiles[tileId] = {
              ...currentTile,
              position: [x, newY],
            }
            previousTile = newTiles[tileId]
            if (!isEqual(currentTile.position, [x, newY])) {
              hasChanged = true
            }
            newY--
          }
        }
      }
      const bestScore = Math.max(state.bestScore, score)
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
        bestScore,
        moves: [...moves, 2],
      }
    }
    case "move_left": {
      const newBoard = createBoard()
      const newTiles: TileMap = {}
      let hasChanged = false
      const { moves } = state
      let { score } = state

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = 0
        let previousTile: Tile | undefined

        for (let x = 0; x < tileCountPerDimension; x++) {
          const tileId = state.board[y][x]
          const currentTile = state.tiles[tileId]

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              score += previousTile.value * 2
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              }
              newTiles[tileId] = {
                ...currentTile,
                position: [newX - 1, y],
              }
              previousTile = undefined
              hasChanged = true
              continue
            }

            newBoard[y][newX] = tileId
            newTiles[tileId] = {
              ...currentTile,
              position: [newX, y],
            }
            previousTile = newTiles[tileId]
            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true
            }
            newX++
          }
        }
      }
      const bestScore = Math.max(state.bestScore, score)
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
        bestScore,
        moves: [...moves, 3],
      }
    }
    case "move_right": {
      const newBoard = createBoard()
      const newTiles: TileMap = {}
      let hasChanged = false
      const { moves } = state
      let { score } = state

      for (let y = 0; y < tileCountPerDimension; y++) {
        let newX = tileCountPerDimension - 1
        let previousTile: Tile | undefined

        for (let x = tileCountPerDimension - 1; x >= 0; x--) {
          const tileId = state.board[y][x]
          const currentTile = state.tiles[tileId]

          if (!isNil(tileId)) {
            if (previousTile?.value === currentTile.value) {
              score += previousTile.value * 2
              newTiles[previousTile.id as string] = {
                ...previousTile,
                value: previousTile.value * 2,
              }
              newTiles[tileId] = {
                ...currentTile,
                position: [newX + 1, y],
              }
              previousTile = undefined
              hasChanged = true
              continue
            }

            newBoard[y][newX] = tileId
            newTiles[tileId] = {
              ...state.tiles[tileId],
              position: [newX, y],
            }
            previousTile = newTiles[tileId]
            if (!isEqual(currentTile.position, [newX, y])) {
              hasChanged = true
            }
            newX--
          }
        }
      }
      const bestScore = Math.max(state.bestScore, score)
      return {
        ...state,
        board: newBoard,
        tiles: newTiles,
        hasChanged,
        score,
        bestScore,
        moves: [...moves, 1],
      }
    }
    case "new_game": {
      let newState = createNewState()
      for (let i = 0; i < 2; i++) {
        const tileId = uid()
        const emptyCells = getEmptyCells(newState)
        const rng = newState.range
        const THRESHOLD_90 = (BigInt("0xFFFFFFFFFFFFFFFF") * 9n) / 10n
        const valueRnd = rng.next()
        const value = valueRnd < THRESHOLD_90 ? 2 : 4
        const randomCell = randomAvailableCell(newState)
        if (emptyCells.length > 0 && randomCell) {
          const newTile = {
            position: randomCell,
            value,
          }
          const newBoard = JSON.parse(JSON.stringify(newState.board))
          newBoard[newTile.position[1]][newTile.position[0]] = tileId
          newState = {
            ...newState,
            board: newBoard,
            tiles: {
              ...newState.tiles,
              [tileId]: {
                id: tileId,
                ...newTile,
              },
            },
            tilesByIds: [...newState.tilesByIds, tileId],
          }
        }
      }

      return newState
    }
    case "reset_game": {
      return initState()
    }
    case "update_status":
      return {
        ...state,
        status: action.status,
      }
    default:
      return state
  }
}
