import { useQuery } from "@tanstack/react-query"
import type { Address, PublicClient } from "viem"
import { getContract } from "viem"
import { useChainId, usePublicClient } from "wagmi"

import { chessPuzzleABI } from "@/shared/config/abi/ChessPuzzle.ABI.ts"
import { NO_WALLET_CONNECTED } from "@/shared/hooks/errors"

export type PuzzleToken = {
  address: Address /// @notice Address of the token
  symbol: string /// @notice Symbol of the token
  decimals: number /// @notice Decimals of the token
}

export type Puzzles = {
  puzzles: string[];
}

export const GET_PUZZLES_KEY = "GET_PUZZLES_KEY"

const getPuzzles = async ({
  publicClient,
  contractAddress,
}: {
  publicClient: PublicClient | undefined
  contractAddress: Address
}): Promise<Puzzles> => {
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

  const unresolvedPuzzles = await chessPuzzleContract.read.getPuzzles()

  if (!unresolvedPuzzles.length) {
    throw new Error("No unresolved puzzles found")
  }

  return {
    puzzles: unresolvedPuzzles as string[],
  }
}

export const useGetPuzzles = (contractAddress: Address) => {
  const chainId = useChainId()
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: [
      GET_PUZZLES_KEY,
      chainId,
      publicClient,
      contractAddress,
    ],
    queryFn: () => getPuzzles({ publicClient, contractAddress }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
