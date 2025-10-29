# ERC-20 Token in Pure Rust

A complete ERC-20 implementation written entirely in Rust and compiled to WASM. Demonstrates how to build a fully compliant token contract without Solidity.

## Overview

* Pure Rust smart contract (no Solidity)
* Fully ERC-20 compatible
* Deterministic WASM builds via `gblend`
* Local testing using `cargo test`
* Source verification through Fluent Blockscout

---

## Prerequisites

* Rust toolchain with `wasm32-unknown-unknown` target
* [gblend](https://github.com/fluentlabs-xyz/gblend) installed
* Docker (required for reproducible builds)

---

## Quick Start

### VS Code Configuration (optional)

To enable Rust Analyzer and Solidity support, create `.vscode/settings.json`:

```json
{
  "rust-analyzer.linkedProjects": [
    "src/erc20/Cargo.toml"
  ],
}
```

### 1. Test Locally

```bash
cd src/erc20
cargo test
```

Runs all unit tests using `HostTestingContext` to simulate blockchain state.

---

### 2. Reproducible Build

```bash
gblend build
```

Builds the contract inside a Docker container with a fixed toolchain.
The resulting artifact is `erc20.wasm`.

---

### 3. Deploy

```bash
gblend create erc20.wasm \
  --rpc-url https://rpc.devnet.fluent.xyz \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --constructor-args "MyToken" "MTK" 1000000
```

> **Note:** Constructor arguments must go last.
> Format: `name`, `symbol`, `initial_supply`.
> Decimals are fixed at **18**.

---

### 4. Verify Contract (optional)

```bash
gblend verify-contract <CONTRACT_ADDRESS> erc20.wasm \
  --rpc-url https://rpc.devnet.fluent.xyz \
  --wasm \
  --verifier blockscout \
  --verifier-url https://devnet.fluentscan.xyz/api/
```

---

### 5. Interact with Contract

Example using [cast](https://book.getfoundry.sh/reference/cast):

```bash
# 1. Check deployer's balance
cast call $CONTRACT_ADDRESS \
  "balanceOf(address)(uint256)" \
  $DEPLOYER_ADDRESS \
  --rpc-url https://rpc.devnet.fluent.xyz

# 2. Transfer tokens to another account
cast send $CONTRACT_ADDRESS \
  "transfer(address,uint256)(bool)" \
  $RECIPIENT_ADDRESS 100 \
  --rpc-url https://rpc.devnet.fluent.xyz \
  --private-key $PRIVATE_KEY

# 3. Check recipient's balance
cast call $CONTRACT_ADDRESS \
  "balanceOf(address)(uint256)" \
  $RECIPIENT_ADDRESS \
  --rpc-url https://rpc.devnet.fluent.xyz

# 4. Check sender's balance
cast call $CONTRACT_ADDRESS \
  "balanceOf(address)(uint256)" \
  $RECIPIENT_ADDRESS \
  --rpc-url https://rpc.devnet.fluent.xyz

```

---

## ERC-20 Methods Implemented

* `name()`, `symbol()`, `decimals()`
* `totalSupply()`, `balanceOf(address)`
* `transfer(to, amount)`
* `approve(spender, amount)`
* `allowance(owner, spender)`
* `transferFrom(from, to, amount)`

---

## References

* [ERC-20 Standard](https://eips.ethereum.org/EIPS/eip-20)
* [Fluent Documentation](https://docs.fluentlabs.xyz)
* [fluentbase_sdk](https://docs.fluentlabs.xyz/sdk)
* [gblend CLI](https://github.com/fluentlabs-xyz/gblend)
* [fluent networks](https://docs.fluent.xyz/connect-to-fluent/#network-parameters-1)
