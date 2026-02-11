import { useState } from "react"

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"

import {
  Header as HeaderUI,
  ConnectWalletDialog,
  ConnectButton
} from "@fluent.xyz/fluent-ui"
import { FLUENT_TESTNET_CHAIN_ID } from "@/shared/config/consts"
import { Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"

interface ProfileDialogProps {
  open: boolean
  handleClose: () => void
  name?: string
  address: `0x${string}` | undefined
  isConnected: boolean
  disconnect: () => void
  switchChain: (args: { chainId: number }) => void
  isWrongNetwork: boolean
}

const ProfileDialog = ({ open, handleClose, name, address, disconnect, switchChain, isWrongNetwork }: ProfileDialogProps) => {

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{name}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body1">{address}</Typography>
      {isWrongNetwork && <Button onClick={() => switchChain({ chainId: FLUENT_TESTNET_CHAIN_ID })}>Switch Chain</Button>}
      <Button onClick={disconnect}>Disconnect</Button>
      </DialogContent>
    </Dialog>
  )
}

export const Header = () => {
  const { address, chainId } = useAccount()
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