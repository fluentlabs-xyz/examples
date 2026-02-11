export const chessPuzzleABI = [
  {
    inputs: [
      {
        internalType: "contract ICheckmateValidator",
        name: "_chess",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "fen",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "PuzzleCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "fen",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "move",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "solver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "PuzzleSolved",
    type: "event",
  },
  {
    inputs: [],
    name: "chess",
    outputs: [
      {
        internalType: "contract ICheckmateValidator",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "fen",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "createPuzzle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "fen",
        type: "string",
      },
    ],
    name: "getPuzzle",
    outputs: [
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPuzzles",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "puzzleList",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "puzzles",
    outputs: [
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "fen",
        type: "string",
      },
      {
        internalType: "string",
        name: "move",
        type: "string",
      },
    ],
    name: "solvePuzzle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
