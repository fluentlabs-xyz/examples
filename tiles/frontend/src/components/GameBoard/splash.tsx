import { useContext, useEffect, useState } from "react"

import { Button } from "@mui/material"
import { useConnect } from "wagmi"
import {
  ConnectWalletDialog
} from "@fluent.xyz/fluent-ui"

import {
  SplashContainer,
  SplashText,
} from "@/components/GameBoard/styles/styles.ts"

import { GameContext } from "./context/game-context"

export default function Splash({
  heading = "You win!",
  type,
}: {
  heading: string
  type?: string
}) {
  const { newGame } = useContext(GameContext)
  const [open, setOpen] = useState(false)
  const [buttonText, setButtonText] = useState("")
  const { connectors, connect } = useConnect()

  useEffect(() => {
    if (type === "wallet") {
      setButtonText("Connect wallet")
    } else {
      setButtonText("Try again")
    }
  }, [type])

  const handleClick = () => {
    if (type === "wallet") {
      setOpen(true)
    }
    newGame()
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <SplashContainer>
      <SplashText>{heading}</SplashText>
      <Button onClick={handleClick}>{buttonText}</Button>
      <ConnectWalletDialog
        open={open}
        handleClose={handleClose}
        connect={connect}
        connectors={connectors}
      />
    </SplashContainer>
  )
}
