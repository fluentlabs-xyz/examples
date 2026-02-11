import ControlButtons from "@/components/ControlButtons"
import GameBoard from "@/components/GameBoard"
import GameProvider from "@/components/GameBoard/context/game-context.tsx"
import Scores from "@/components/Scores"

import { Container } from "./styles.js"

const TilesGame = () => (
  <GameProvider>
    <Container>
      <Scores />
      <GameBoard />
      <ControlButtons />
    </Container>
  </GameProvider>
)
export default TilesGame
