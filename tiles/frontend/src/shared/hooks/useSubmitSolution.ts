import { useMutation } from "@tanstack/react-query"
import type { Address, PublicClient } from "viem"
import { useAccount, useConfig, usePublicClient } from "wagmi"
import type { Config } from "wagmi"
import { writeContract } from "wagmi/actions"

import { tilesAbiABI } from "@/shared/config/abi/TilesAbi.ABI.ts"
import {
  NO_WALLET_CONNECTED,
  TRANSACTION_REVERTED,
} from "@/shared/hooks/errors"

import { TILES_GAME_ADDRESS } from "../config/consts"

const directionToBits = {
  0: 0b10,
  1: 0b01,
  2: 0b11,
  3: 0b00,
}

function encodeMoves(moves: (0 | 1 | 2 | 3)[]) {
  const bytes = []
  let currentByte = 0
  let bitPosition = 6
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i]
    const bits = directionToBits[move]
    currentByte |= bits << bitPosition

    if (bitPosition === 0) {
      bytes.push(currentByte)
      currentByte = 0
      bitPosition = 6
    } else {
      bitPosition -= 2
    }

    if (i === moves.length - 1 && bitPosition !== 6) {
      bytes.push(currentByte)
    }
  }
  const hexString = `0x${bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("")}`
  const encodedMoves = {
    moves: hexString as `0x${string}`,
    moveCount: BigInt(moves.length),
  }

  return encodedMoves
}

export type SolutionMutationArgs = {
  seed: bigint
  moves: (0 | 1 | 2 | 3)[]
}

export type SolvePuzzleMutationFnParams = {
  publicClient: PublicClient | undefined
  address: Address | undefined
  config: Config
  args: SolutionMutationArgs
}

const solutionMutation = async ({
  publicClient,
  address,
  config,
  args,
}: SolvePuzzleMutationFnParams) => {
  if (!address || !publicClient) {
    throw new Error(NO_WALLET_CONNECTED)
  }
  const { moves, seed } = args
  const encodedMoves = encodeMoves(moves)
  const txHash = await writeContract(config, {
    address: TILES_GAME_ADDRESS,
    abi: tilesAbiABI,
    functionName: "playGame",
    args: [seed, encodedMoves.moves, encodedMoves.moveCount],
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

export const useSubmitSolution = () => {
  const publicClient = usePublicClient()
  const config = useConfig()
  const { address } = useAccount()

  return useMutation({
    mutationFn: (args: SolutionMutationArgs) =>
      solutionMutation({ publicClient, address, config, args }),
  })
}
