// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ICheckmateValidator} from "../../out/checkmate-validator.wasm/interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ChessPuzzle is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Puzzle {
        address creator;
        address tokenAddress;
        uint256 reward;
        bool isActive;
        uint256 listIndex; // index in puzzleList for O(1) removal
    }

    mapping(string => Puzzle) public puzzles;
    string[] public puzzleList;
    ICheckmateValidator public immutable chess;

    event PuzzleCreated(
        string indexed fen,
        uint256 reward,
        address indexed tokenAddress,
        address indexed creator
    );

    event PuzzleSolved(
        string fen,
        string move,
        address indexed solver,
        uint256 indexed reward,
        address indexed tokenAddress
    );

    event PuzzleCancelled(
        string indexed fen,
        address indexed creator,
        uint256 reward
    );

    constructor(ICheckmateValidator _chess) {
        chess = _chess;
    }

    /// @notice Create a new chess puzzle with a token reward
    /// @param fen Initial position of pieces in FEN format
    /// @param reward Reward in tokens for solving the puzzle
    /// @param tokenAddress Address of the reward token
    function createPuzzle(
        string calldata fen,
        uint256 reward,
        address tokenAddress
    ) external nonReentrant {
        require(reward > 0, "Reward must be greater than 0");
        require(puzzles[fen].creator == address(0), "Puzzle already exists");
        require(chess.isBoardValid(fen), "Invalid board configuration");

        // Effects before interactions (CEI pattern)
        uint256 index = puzzleList.length;
        puzzles[fen] = Puzzle({
            creator: msg.sender,
            tokenAddress: tokenAddress,
            reward: reward,
            isActive: true,
            listIndex: index
        });
        puzzleList.push(fen);

        // Interaction last
        IERC20(tokenAddress).safeTransferFrom(
            msg.sender,
            address(this),
            reward
        );

        emit PuzzleCreated(fen, reward, tokenAddress, msg.sender);
    }

    /// @notice Attempt to solve a puzzle by providing a checkmate move
    /// @param fen Initial position of pieces in FEN format
    /// @param move Move string that solves the puzzle (e.g. "e2e4")
    function solvePuzzle(
        string calldata fen,
        string calldata move
    ) external nonReentrant {
        Puzzle storage puzzle = puzzles[fen];
        require(puzzle.creator != address(0), "Puzzle does not exist");
        require(puzzle.isActive, "Puzzle is not active");
        require(chess.isCheckmate(fen, move), "Incorrect move");

        // Cache before cleanup
        address tokenAddress = puzzle.tokenAddress;
        uint256 reward = puzzle.reward;

        // Effects: deactivate and remove
        puzzle.isActive = false;
        _removePuzzleFromList(fen);
        delete puzzles[fen];

        // Interaction last
        IERC20(tokenAddress).safeTransfer(msg.sender, reward);

        emit PuzzleSolved(fen, move, msg.sender, reward, tokenAddress);
    }

    /// @notice Allow puzzle creator to cancel and reclaim their reward
    /// @param fen FEN of the puzzle to cancel
    function cancelPuzzle(string calldata fen) external nonReentrant {
        Puzzle storage puzzle = puzzles[fen];
        require(puzzle.creator == msg.sender, "Only creator can cancel");
        require(puzzle.isActive, "Puzzle is not active");

        address tokenAddress = puzzle.tokenAddress;
        uint256 reward = puzzle.reward;

        puzzle.isActive = false;
        _removePuzzleFromList(fen);
        delete puzzles[fen];

        IERC20(tokenAddress).safeTransfer(msg.sender, reward);

        emit PuzzleCancelled(fen, msg.sender, reward);
    }

    /// @notice Get puzzle information by FEN
    function getPuzzle(
        string calldata fen
    )
        external
        view
        returns (
            address creator,
            address tokenAddress,
            uint256 reward,
            bool isActive
        )
    {
        Puzzle storage puzzle = puzzles[fen];
        return (
            puzzle.creator,
            puzzle.tokenAddress,
            puzzle.reward,
            puzzle.isActive
        );
    }

    /// @notice Get all active puzzle FEN strings
    function getPuzzles() external view returns (string[] memory) {
        return puzzleList;
    }

    /// @notice Get the number of active puzzles
    function getPuzzleCount() external view returns (uint256) {
        return puzzleList.length;
    }

    /// @dev O(1) removal from puzzleList using swap-and-pop with tracked index
    function _removePuzzleFromList(string calldata fen) internal {
        Puzzle storage puzzle = puzzles[fen];
        uint256 index = puzzle.listIndex;
        uint256 lastIndex = puzzleList.length - 1;

        if (index != lastIndex) {
            string memory lastFen = puzzleList[lastIndex];
            puzzleList[index] = lastFen;
            puzzles[lastFen].listIndex = index;
        }

        puzzleList.pop();
    }
}
