import { Link } from "react-router-dom"

import TileGames from "@/components/TilesGame"
import {
  Container,
  CreatedBy,
  Instruction,
  InstructionDescription,
  InstructionName,
  Instructions,
  WhiteCard,
} from "@/pages/tiles/styles.ts"

function TilesPage() {
  return (
    <Container>
      <WhiteCard>
        <TileGames />
      </WhiteCard>
      <Instructions>
        <Instruction>
          <InstructionName>HOW TO PLAY:</InstructionName>
          <InstructionDescription>
            Use your arrow keys to move the tiles. When two tiles with the same
            letter touch, they merge into one!The game continues until a tile
            with the letter `z` (representing 1024 points) is created. Instead
            of numbers, this version of the game uses letters, but the score
            calculation remains the same as the original 2048 game.
          </InstructionDescription>
        </Instruction>
        <Instruction>
          <InstructionName>GAME END:</InstructionName>
          <InstructionDescription>
            When the game ends, a transaction is automatically sent to the
            contract. The transaction includes the seed used to generate the
            field and a list of moves (each move is encoded using only two bits,
            so we also receive the number of moves to handle situations where
            the number of moves is not a multiple of 8). The contract will
            transfer tokens to the address from which the transaction was sent
            (the player`s address). The token address is
            0xb932C8342106776E73E39D695F3FFC3A9624eCE0 . The number of tokens
            transferred is equal to the points scored in the game. Don`t forget
            to add this token to your wallet.
          </InstructionDescription>
        </Instruction>
        <Instruction>
          <InstructionName>ORIGINAL PROJECT:</InstructionName>
          <InstructionDescription>
            This project is inspired by the original 2048 game created by
            Gabriele Cirulli. The original game can be played on your phone via
            http://git.io/2048. All other apps or sites are derivatives or fakes
            and should be used with caution.
          </InstructionDescription>
        </Instruction>
      </Instructions>
      <CreatedBy>
        Created by{" "}
        <Link to="https://gabrielecirulli.com/">Gabriele Cirulli</Link>. Based
        on{" "}
        <Link to="https://apps.apple.com/us/app/1024/id823499224">
          1024 by Veewo Studioand
        </Link>{" "}
        conceptually similar to{" "}
        <Link to="https://asherv.com/threes/">Threes by Asher Vollmer.</Link>
      </CreatedBy>
    </Container>
  )
}

export default TilesPage
