# Tiles

On-chain 2048-style Tiles game on Fluent Network.
A Solidity game contract pays ERC-20 rewards based on scores returned by a Rust/WASM validator.

**Stack:** Solidity + Rust/WASM, deployed via [gblend](https://github.com/fluentlabs-xyz/gblend) (Foundry fork for Fluent).

## Prerequisites

- [gblend](https://github.com/fluentlabs-xyz/gblend) installed
- Rust toolchain
- `.env` configured (see `.example.env`)

## Build

```bash
gblend install
gblend build
```

This compiles Solidity and Rust/WASM contracts and generates:

- `out/validator.wasm/foundry.json`
- `out/validator.wasm/interface.sol`

## Deploy

```bash
gblend script script/Deploy.s.sol --broadcast --rpc-url $RPC_URL
```

Save addresses from output:

```bash
export TILES_TOKEN_ADDRESS=0x...
export TILES_GAME_ADDRESS=0x...
export VALIDATOR_ADDRESS=0x...
```

## Fund contracts

```bash
gblend script script/FundGame.s.sol --broadcast --rpc-url $RPC_URL
```

Optional player funding:

```bash
gblend script script/FundPlayer.s.sol --broadcast --rpc-url $RPC_URL
```

## Verify with cast

```bash
# Read score from validator
cast call $VALIDATOR_ADDRESS \
  "getScore(uint64,bytes,uint64)(uint256)" \
  123456789 \
  0x2281a46986247100 \
  29 \
  --rpc-url $RPC_URL

# Play game and claim reward tokens
cast send $TILES_GAME_ADDRESS \
  "playGame(uint64,bytes,uint64)" \
  123456789 \
  0x2281a46986247100 \
  29 \
  --rpc-url $RPC_URL --private-key $PLAYER_PRIVATE_KEY

# Check player token balance
cast call $TILES_TOKEN_ADDRESS \
  "balanceOf(address)(uint256)" \
  $PLAYER_ADDRESS \
  --rpc-url $RPC_URL
```
