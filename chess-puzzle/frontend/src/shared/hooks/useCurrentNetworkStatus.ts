import { useAccount } from "wagmi"

import { FLUENT_TESTNET_CHAIN_ID } from "@/shared/config/consts"

export const checkIsWrongNetwork = (currentChainId: number | undefined) =>
  currentChainId !== FLUENT_TESTNET_CHAIN_ID

export const useCurrentNetworkStatus = () => {
  const { chainId } = useAccount()

  return {
    chainId,
    isWrongNetwork: checkIsWrongNetwork(chainId),
  }
}
