import { useState } from "react"

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"

import {
  Header as HeaderUI,
  useCurrentNetworkStatus,
  ProfileDialog,
  ConnectWalletDialog,
  ConnectButton
} from "@fluent.xyz/fluent-ui"

export const Header = () => {
  const { address, isConnected } = useAccount()
  const { isWrongNetwork } = useCurrentNetworkStatus()
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
      isWrongNetwork={isWrongNetwork}
      profileDialog={ProfileDialog}
      connectors={connectors}
      connect={connect}
      disconnect={disconnect}
      switchChain={switchChain}
      connectWalletDialog={ConnectWalletDialog}
    />
  )

  return <HeaderUI name="TILES" button={buttonRender} />
}

