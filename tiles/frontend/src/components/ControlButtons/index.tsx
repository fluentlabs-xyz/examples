import { useContext } from "react"

import { useAccount } from "wagmi"

import { GameContext } from "@/components/GameBoard/context/game-context.tsx"
import { useCurrentNetworkStatus } from "@/shared/hooks/useCurrentNetworkStatus.ts"
import { useSubmitSolution } from "@/shared/hooks/useSubmitSolution.ts"

import { ButtonsContainer, NewGameBtn, SolutionBtn } from "./styles.ts"

const ControlButtons = () => {
  const { newGame, moves, seed } = useContext(GameContext)
  const { mutateAsync: submitSolution } = useSubmitSolution()
  const { isConnected } = useAccount()
  const { isWrongNetwork } = useCurrentNetworkStatus()

  if (!isConnected) return null

  const handleSubmit = async () => {
    await submitSolution({ moves, seed })
  }

  return (
    <ButtonsContainer>
      <SolutionBtn
        disabled={isWrongNetwork}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        submit solution
      </SolutionBtn>
      <NewGameBtn
        disabled={isWrongNetwork}
        variant="outlined"
        color="secondary"
        onClick={newGame}
      >
        new game
      </NewGameBtn>
    </ButtonsContainer>
  )
}
export default ControlButtons
