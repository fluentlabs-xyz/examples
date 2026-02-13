import { useContext } from "react"

import { useAccount } from "wagmi"

import { GameContext } from "@/components/GameBoard/context/game-context.tsx"

import { ScoreItem, ScoreName, ScoresLayout, ScoreValue } from "./styles.js"

const Scores = () => {
  const { score, bestScore } = useContext(GameContext)
  const { isConnected } = useAccount()

  if (!isConnected) return null

  return (
    <ScoresLayout>
      <ScoreItem>
        <ScoreName>Score</ScoreName>
        <ScoreValue>{score}</ScoreValue>
      </ScoreItem>
      <ScoreItem>
        <ScoreName>Best</ScoreName>
        <ScoreValue>{bestScore}</ScoreValue>
      </ScoreItem>
    </ScoresLayout>
  )
}
export default Scores
