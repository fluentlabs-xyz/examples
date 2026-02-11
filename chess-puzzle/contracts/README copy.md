# Chess Puzzle

On-chain mate-in-one puzzles on Fluent Network. A Solidity contract holds ERC-20 token rewards; a WASM contract (Rust + shakmaty) validates checkmate moves. Solve the puzzle — claim the reward.

**Stack:** Solidity + Rust/WASM, deployed via [gblend](https://github.com/fluentlabs-xyz/gblend) (Foundry fork for Fluent).

## Deploy & Create Puzzles

### Prerequisites

- [gblend](https://github.com/fluentlabs-xyz/gblend) installed
- Node.js + `npm install chess.js`

### 1. Build & Deploy

```bash
gblend install

gblend build

gblend script script/Deploy.s.sol --broadcast --rpc-url $RPC_URL
```

Save the output addresses:

```bash
export ELO_TOKEN_ADDRESS=0x...
export CHESS_PUZZLE_ADDRESS=0x...
export CHECKMATE_VALIDATOR_ADDRESS=0x...
```

### 2. Generate Puzzles

```bash
node script/generate_puzzles/generate_puzzles.mjs 100
```

This creates `puzzles.json` with 100 mate-in-one positions and their solutions:

```json
{
  "puzzles": [
    { "fen": "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4", "solution": "..." },
  ]
}
```

### 3. Create Puzzles On-Chain

```bash
PUZZLE_REWARD=1000 \
gblend script script/CreatePuzzles.s.sol --broadcast --rpc-url $RPC_URL
```

### 4. Verify with cast

```bash
# List all active puzzles
cast call $CHESS_PUZZLE_ADDRESS "getPuzzles()(string[])" --rpc-url $RPC_URL

# Get puzzle details
cast call $CHESS_PUZZLE_ADDRESS \
  "getPuzzle(string)(address,address,uint256,bool)" \
  "rnbq1k1r/1p1p3p/5npb/2pQ1p2/p1B1P2P/8/PPP2PP1/RNB1K1NR w KQ - 2 11" \
  --rpc-url $RPC_URL

# Check if a move is checkmate
cast call $CHECKMATE_VALIDATOR_ADDRESS \
  "isCheckmate(string,string)(bool)" \
  "rnbq1k1r/1p1p3p/5npb/2pQ1p2/p1B1P2P/8/PPP2PP1/RNB1K1NR w KQ - 2 11" \
  "Qf7" \
  --rpc-url $RPC_URL

# Solve a puzzle and claim the reward
cast send $CHESS_PUZZLE_ADDRESS \
  "solvePuzzle(string,string)" \
  "rnbq1k1r/1p1p3p/5npb/2pQ1p2/p1B1P2P/8/PPP2PP1/RNB1K1NR w KQ - 2 11" \
  "Qf7" \
  --rpc-url $RPC_URL --private-key $SOLVER_PRIVATE_KEY
```
