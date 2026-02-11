import { Chess } from "chess.js";
import { writeFileSync } from "fs";

const count = Number.parseInt(process.argv[2] ?? "10", 10);
if (!Number.isFinite(count) || count <= 0) {
  console.error("Usage: node script/utils/generate_puzzles.mjs <count>");
  process.exit(1);
}

function findMateInOne(chess) {
  for (const move of chess.moves()) {
    chess.move(move);
    const checkmate = chess.isCheckmate();
    chess.undo();
    if (checkmate) return move;
  }
  return null;
}

const puzzles = [];
const seenFens = new Set();
let attempts = 0;

while (puzzles.length < count) {
  attempts++;
  const chess = new Chess();

  // Play 20-40 random moves for mid/late-game positions
  const depth = 20 + Math.floor(Math.random() * 21);
  for (let i = 0; i < depth; i++) {
    const moves = chess.moves();
    if (moves.length === 0) break;
    chess.move(moves[Math.floor(Math.random() * moves.length)]);
    if (chess.isGameOver()) break;

    // Check for mate-in-one at every position after move 15
    if (i >= 15) {
      const fen = chess.fen();
      if (!seenFens.has(fen)) {
        const solution = findMateInOne(chess);
        if (solution) {
          seenFens.add(fen);
          puzzles.push({ fen, solution });
          if (puzzles.length % 10 === 0) {
            process.stderr.write(`${puzzles.length}/${count} (${attempts} games)\n`);
          }
          if (puzzles.length >= count) break;
        }
      }
    }
  }
}

const output = {
  fens: puzzles.map((p) => p.fen),
  solutions: puzzles.map((p) => p.solution),
};
writeFileSync("puzzles.json", JSON.stringify(output, null, 2));
console.log(`Generated ${puzzles.length} puzzles in ${attempts} games → puzzles.json`);
