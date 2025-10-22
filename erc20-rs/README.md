# ERC-20 Token in Pure Rust

A complete ERC-20 token implementation written entirely in Rust and compiled to WASM. This example demonstrates how to build a full-featured token contract without Solidity.

## What This Demonstrates

- **Pure Rust smart contract** - No Solidity required
- **Full ERC-20 standard** - All standard token methods
- **State management in WASM** - Using `fluentbase_sdk` storage
- **Unit testing** - Rust native tests with `HostTestingContext`

## Prerequisites

- Basic understanding of ERC-20 tokens
- Familiarity with Rust
- Rust toolchain with `wasm32-unknown-unknown` target
- gblend installed ([installation guide](https://github.com/fluentlabs-xyz/gblend))
- Docker (for reproducible builds with gblend)

## Project Structure

```
erc20/
├── src/
│   └── lib.rs           # ERC-20 implementation with tests
└── Cargo.toml
```

## Part 1: Development & Testing (Standard Rust Workflow)

During development, you work with this contract like any other Rust project.

### Local Development Build

```bash
# Add WASM target if not already installed
rustup target add wasm32-unknown-unknown

# Build locally for development
cargo build --target wasm32-unknown-unknown --release
```

The compiled WASM will be in `target/wasm32-unknown-unknown/release/erc20.wasm`.

### Running Tests

```bash
cargo test
```

Tests use `HostTestingContext` to simulate blockchain state without requiring a node. This allows for fast iteration during development.

```bash
# Run with output
cargo test -- --nocapture

# Run specific test
cargo test test_transfer_functionality
```

See inline comments in `src/lib.rs` for detailed test examples.

### Development Iteration

The standard Rust development cycle applies:

1. Write/modify code in `src/lib.rs`
2. Run `cargo test` to verify changes
3. Use `cargo clippy` for linting
4. Use `cargo fmt` for formatting
5. Repeat

## Part 2: Deployment (Using gblend)

For deployment, we use gblend to ensure reproducible builds. This is important because:

- **Reproducibility** - Anyone can verify the deployed bytecode matches the source
- **Consistency** - Same source always produces identical WASM
- **Verification** - Block explorers can verify contract source code

### Reproducible Build

```bash
gblend build
```

This compiles your contract inside a Docker container with a fixed toolchain. The first build may take longer as it downloads the container image.

### Deploy to Testnet

```bash
gblend create Erc20.wasm \
    --rpc-url https://rpc.testnet.fluent.xyz \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --wasm \
    --constructor-args "MyToken" "MTK" 1000000
```

**Important:** `--constructor-args` must be the last argument.

**Constructor arguments:**

- Token name (e.g., "MyToken")
- Token symbol (e.g., "MTK")
- Initial supply (e.g., 1000000 - minted to deployer)

**Note:** Decimals are fixed at 18 in this implementation.

### Deploy with Verification

To make your source code publicly viewable on the block explorer:

```bash
gblend create Erc20.wasm \
    --rpc-url https://rpc.testnet.fluent.xyz \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --wasm \
    --verify \
    --verifier blockscout \
    --verifier-url https://testnet.fluentscan.xyz/api/ \
    --constructor-args "MyToken" "MTK" 1000000
```

## Quick Reference

```bash
# Development cycle
cargo test                    # Run tests
cargo build --target wasm32-unknown-unknown --release  # Local build

# Deployment
gblend build                  # Reproducible build
gblend create Erc20.wasm ...  # Deploy to network
```

## Key Concepts

### Pure Rust Benefits

- **Type safety** - Compile-time error checking prevents common bugs
- **Memory safety** - No buffer overflows or null pointer dereferences
- **Performance** - Optimized WASM execution near-native speed
- **Testing** - Rich Rust testing ecosystem with cargo test
- **Tooling** - Full IDE support, clippy, rust-analyzer

### ERC-20 Methods

All standard ERC-20 methods are implemented:

- `name()`, `symbol()`, `decimals()` - Token metadata
- `totalSupply()` - Total token supply
- `balanceOf(address)` - Get account balance
- `transfer(to, amount)` - Transfer tokens
- `approve(spender, amount)` - Approve spending allowance
- `allowance(owner, spender)` - Check approved allowance
- `transferFrom(from, to, amount)` - Transfer using allowance

## Extending This Example

Ideas for modifications:

- **Minting/burning** - Add supply management functions
- **Pausable** - Emergency stop mechanism
- **Access control** - Owner-only administrative functions
- **Vesting** - Time-locked token release schedules
- **Fee mechanism** - Take percentage on transfers
- **Snapshots** - Historical balance tracking for governance

## Further Reading

- [ERC-20 Standard](https://eips.ethereum.org/EIPS/eip-20)
- [gblend Documentation](https://github.com/fluentlabs-xyz/gblend)
- [Fluent Documentation](https://docs.fluentlabs.xyz)
- [fluentbase_sdk Documentation](https://docs.fluentlabs.xyz/sdk)
