import { useState } from "react"

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"

import {
  Header as HeaderUI,
  ProfileDialog,
  ConnectWalletDialog,
  ConnectButton
} from "@fluent.xyz/fluent-ui"
import { FLUENT_TESTNET_CHAIN_ID } from "@/shared/config/consts"

export const Header = () => {
  const { address, isConnected, chainId } = useAccount()
  const [open, setOpen] = useState(false)
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const buttonRender = (
    <ConnectButton
      open={open}
      setOpen={setOpen}
      address={address}
      isConnected={isConnected}
      isWrongNetwork={chainId !== FLUENT_TESTNET_CHAIN_ID}
      profileDialog={ProfileDialog}
      connectors={connectors}
      connect={connect}
      disconnect={disconnect}
      switchChain={switchChain}
      connectWalletDialog={ConnectWalletDialog}
    />
  )

  return (
    <HeaderUI
      icon={<img src="/ChessImage.svg" style={{ maxWidth: 30 }} alt="chess-image" />}
      name="Chess Puzzle"
      button={buttonRender}
    />
  )
}