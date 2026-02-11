import { useMutation } from "@tanstack/react-query"
import type { Address, PublicClient } from "viem"
import { useAccount, useConfig, usePublicClient } from "wagmi"
import type { Config } from "wagmi"
import { writeContract } from "wagmi/actions"

import { chessPuzzleABI } from "@/shared/config/abi/ChessPuzzle.ABI"
import {
  NO_WALLET_CONNECTED,
  TRANSACTION_REVERTED,
} from "@/shared/hooks/errors"

export type SolveMutationArgs = {
  fen: string
  move: string
}

export type SolvePuzzleMutationFnParams = {
  publicClient: PublicClient | undefined
  address: Address | undefined
  config: Config
  contractAddress: Address
  args: SolveMutationArgs
}

const solvePuzzleMutation = async ({
  publicClient,
  address,
  config,
  contractAddress,
  args,
}: SolvePuzzleMutationFnParams) => {
  if (!address || !publicClient) {
    throw new Error(NO_WALLET_CONNECTED)
  }

  const { fen, move } = args

  const txHash = await writeContract(config, {
    address: contractAddress,
    abi: chessPuzzleABI,
    functionName: "solvePuzzle",
    args: [fen, move],
  })

  const txReceipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  })

  if (txReceipt.status === "reverted") {
    throw new Error(TRANSACTION_REVERTED)
  }

  return txReceipt
}

export const useSolvePuzzle = (contractAddress: Address) => {
  const publicClient = usePublicClient()
  const config = useConfig()
  const { address } = useAccount()

  return useMutation({
    mutationFn: (args: SolveMutationArgs) =>
      solvePuzzleMutation({
        publicClient,
        address,
        config,
        args,
        contractAddress,
      }),
  })
}
