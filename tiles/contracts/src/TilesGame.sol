// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IValidator} from "../out/validator.wasm/interface.sol";

/// @title TilesGame
/// @notice Rewards players with tokens based on scores returned by a WASM validator.
contract TilesGame is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IValidator public validator;
    IERC20 public token;
    address public owner;
    uint8 public tokenDecimals;
    uint256 public maxScore;
    mapping(uint64 => bool) public usedSeeds;

    event ValidatorSet(address indexed newValidator);
    event TokenSet(address indexed newToken, uint8 tokenDecimals);
    event GamePlayed(
        address indexed player,
        uint64 seed,
        uint256 score,
        uint256 tokensTransferred
    );
    event TokenTransferred(address indexed to, uint256 amount);

    constructor(
        IValidator _validator,
        address _token,
        uint8 _tokenDecimals,
        uint256 _maxScore
    ) {
        require(
            address(_validator) != address(0),
            "Validator address cannot be zero"
        );
        require(_token != address(0), "Token address cannot be zero");

        validator = _validator;
        token = IERC20(_token);
        owner = msg.sender;
        tokenDecimals = _tokenDecimals;
        maxScore = _maxScore;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function setValidator(address _validator) external onlyOwner {
        require(_validator != address(0), "Validator address cannot be zero");
        validator = IValidator(_validator);
        emit ValidatorSet(_validator);
    }

    function setToken(address _token, uint8 _tokenDecimals) external onlyOwner {
        require(_token != address(0), "Token address cannot be zero");
        token = IERC20(_token);
        tokenDecimals = _tokenDecimals;
        emit TokenSet(_token, _tokenDecimals);
    }

    function playGame(
        uint64 seed,
        bytes calldata moves,
        uint64 numMoves
    ) external nonReentrant {
        require(!usedSeeds[seed], "Seed already used");
        require(moves.length > 0, "Moves cannot be empty");

        uint256 score = validator.getScore(seed, moves, numMoves);
        require(score > 0, "Invalid score");

        if (score > maxScore) {
            score = maxScore;
        }

        uint256 tokensToTransfer = score * (10 ** uint256(tokenDecimals));
        require(
            token.balanceOf(address(this)) >= tokensToTransfer,
            "Not enough tokens in the contract"
        );
        token.safeTransfer(msg.sender, tokensToTransfer);

        usedSeeds[seed] = true;
        emit GamePlayed(msg.sender, seed, score, tokensToTransfer);
    }

    function transferToken(
        address _to,
        uint256 _amount
    ) external onlyOwner nonReentrant {
        require(
            token.balanceOf(address(this)) >= _amount,
            "Not enough tokens in the contract"
        );
        token.safeTransfer(_to, _amount);

        emit TokenTransferred(_to, _amount);
    }

    receive() external payable {}

    fallback() external payable {
        revert("Function not recognized");
    }
}
