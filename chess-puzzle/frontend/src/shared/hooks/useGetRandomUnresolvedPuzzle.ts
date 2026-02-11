import { useQuery } from "@tanstack/react-query"
import type { Address, PublicClient } from "viem"
import { getContract, erc20Abi } from "viem"
import { useChainId, usePublicClient } from "wagmi"

import { chessPuzzleABI } from "@/shared/config/abi/ChessPuzzle.ABI.ts"
import { NO_WALLET_CONNECTED } from "@/shared/hooks/errors"

export type PuzzleToken = {
  address: Address /// @notice Address of the token
  symbol: string /// @notice Symbol of the token
  decimals: number /// @notice Decimals of the token
}

export type UnresolvedPuzzle = {
  fen: string /// @notice fen Initial position of pieces in FEN format
  creator: Address /// @notice Address of the puzzle creator
  token: PuzzleToken /// @notice Address of the reward token
  reward: bigint /// @notice Reward in tokens for solving the puzzle
  isActive: boolean /// @notice Status of the puzzle: solved or not
}

export const GET_RANDOM_UNSOLVED_PUZZLE_KEY = "GET_RANDOM_UNSOLVED_PUZZLE_KEY"

const getRandomUnresolvedPuzzle = async ({
  publicClient,
  contractAddress,
}: {
  publicClient: PublicClient | undefined
  contractAddress: Address
}): Promise<UnresolvedPuzzle> => {
  if (!publicClient) {
    throw new Error(NO_WALLET_CONNECTED)
  }
  const chessPuzzleContract = getContract({
    address: contractAddress,
    abi: chessPuzzleABI,
    client: {
      public: publicClient,
    },
  })

  const unresolvedPuzzlesFens = await chessPuzzleContract.read.getPuzzles()

  if (!unresolvedPuzzlesFens.length) {
    throw new Error("No unresolved puzzles found")
  }

  const randomPuzzleFen =
    unresolvedPuzzlesFens[
      Math.floor(Math.random() * unresolvedPuzzlesFens.length)
    ]

  const puzzle = await chessPuzzleContract.read.getPuzzle([
    `${randomPuzzleFen}`,
  ])

  const puzzleTokenContract = getContract({
    address: puzzle[1],
    abi: erc20Abi,
    client: {
      public: publicClient,
    },
  })

  const puzzleTokenSymbol = await puzzleTokenContract.read.symbol()
  const puzzleTokenDecimals = await puzzleTokenContract.read.decimals()

  return {
    fen: `${randomPuzzleFen}`,
    creator: puzzle[0],
    token: {
      address: puzzle[1],
      symbol: puzzleTokenSymbol,
      decimals: puzzleTokenDecimals,
    },
    reward: puzzle[2],
    isActive: puzzle[3],
  }
}

export const useGetRandomUnresolvedPuzzle = (contractAddress: Address) => {
  const chainId = useChainId()
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: [
      GET_RANDOM_UNSOLVED_PUZZLE_KEY,
      chainId,
      publicClient,
      contractAddress,
    ],
    queryFn: () => getRandomUnresolvedPuzzle({ publicClient, contractAddress }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
