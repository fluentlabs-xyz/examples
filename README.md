# gblend Examples

Collection of example projects for gblend - a Solidity development framework with WASM integration.

## Using Examples

### List all available examples

```bash
gblend init --list-examples
```

### Initialize a new project with an example

```bash
# Use a specific example from this repository
gblend init --template erc20-rs

# Initialize in a specific directory
gblend init my-project --template erc20-rs
```

**Note:** When using `--template`, you only need to specify the example name. gblend will automatically fetch it from this repository.

## Contributing a New Example

We welcome contributions! To add a new example to this repository:

### 1. Create your example directory

Create a new directory with a descriptive name (e.g., `nft-collection`, `defi-vault`). Structure it as a complete gblend project:

```
your-example-name/
├── README.md              # REQUIRED - Clear documentation
├── foundry.toml           # Optional - default will be added if missing
├── .gitignore             # Optional - default will be added if missing
├── src/
│   ├── YourContract.sol   # Solidity contracts (if any)
│   └── your-module/       # Rust WASM module (if applicable)
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs
├── test/
│   └── YourContract.t.sol # Tests
└── script/
    └── YourContract.s.sol # Deployment scripts
```

**Important notes:**

- **`README.md` is required** - Users need documentation to understand your example
- `foundry.toml` is optional - If not provided, gblend will create a default configuration
- `.gitignore` is optional - If not provided, gblend will add a standard one

### 2. Write clear documentation

Your example's `README.md` **must** include:

- **What it demonstrates** - The key concepts or patterns shown
- **Prerequisites** - Required knowledge or tools
- **How to build and test** - Step-by-step instructions

  ```bash
  gblend build
  gblend test
  ```

- **Key concepts explained** - Walk through important code sections
- **Project structure** - Brief overview of files and their purpose
- **Further reading** - Links to relevant documentation (optional)

**Tip:** Look at existing examples for inspiration on documentation structure.

### 3. Add your example to `examples.json`

**This step is required!** Add an entry to the root `examples.json` file:

```json
{
  "name": "your-example-name",
  "description": "Brief, clear description (aim for 50-70 characters)",
  "difficulty": "beginner|intermediate|advanced",
  "tags": ["relevant", "tags"]
}
```

#### Difficulty Guidelines

- **`beginner`** - Simple concepts, minimal prerequisites, good starting point
- **`intermediate`** - More complex features, assumes familiarity with basics
- **`advanced`** - Complex patterns, optimizations, or advanced techniques

#### Suggested Tags

Choose relevant tags to help users find your example:

- **Technology**: `wasm`, `solidity`, `rust`
- **Use case**: `token`, `nft`, `defi`, `dao`, `oracle`
- **Standards**: `erc20`, `erc721`, `erc1155`
- **Complexity**: `minimal`, `tutorial`, `production-ready`
- **Architecture**: `solidity-rust`, `rust-only`, `hybrid`

### 4. Test your example

Before submitting, verify:

- ✅ `README.md` exists and is comprehensive
- ✅ `gblend build` compiles successfully
- ✅ `gblend test` passes all tests
- ✅ Code follows best practices
- ✅ Documentation is clear and complete
- ✅ No sensitive data or credentials in code
- ✅ All necessary files are included (contracts, tests, scripts)

### 5. Submit a Pull Request

Create a PR with:

1. Your example directory with all files
2. Updated `examples.json` with your entry
3. Clear PR description explaining:
   - What the example demonstrates
   - Who the target audience is
   - Any special requirements or notes

## Example Quality Guidelines

Good examples should:

- **Focus on one concept** - Don't try to teach everything at once
- **Include comments** - Explain non-obvious code sections
- **Be self-contained** - Work out of the box after `gblend init --template <name>`
- **Follow conventions** - Use standard project structure
- **Have clear documentation** - A well-written README is essential
- **Be maintainable** - Keep dependencies minimal and up to date

## Default Files

When users initialize a project with your example, gblend will automatically:

- Add a default `foundry.toml` if your example doesn't include one
- Add a standard `.gitignore` if your example doesn't include one
- Initialize git repository (unless `--no-git` flag is used)

This means you can focus on the core example code and let gblend handle standard configuration files. However, if your example requires specific configuration, feel free to include custom `foundry.toml` or `.gitignore` files.

## Questions or Issues?

- [gblend Documentation](https://github.com/fluentlabs-xyz/gblend)
- [Fluent Documentation](https://docs.fluentlabs.xyz)
- [Open an Issue](https://github.com/fluentlabs-xyz/examples/issues)

## License

Examples are provided under [MIT License](./LICENSE) unless otherwise specified in individual example directories.
