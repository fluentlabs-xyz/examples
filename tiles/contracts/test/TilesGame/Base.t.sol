// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {TilesGame} from "../../src/TilesGame.sol";
import {TilesToken} from "../../src/TilesToken.sol";
import {IValidator} from "../../out/validator.wasm/interface.sol";

interface IValidatorHarness {
    function getScore(uint64 seed, bytes calldata moves, uint64 movesLen) external returns (uint256);
}

abstract contract BaseTilesGameTest is Test {
    TilesGame internal game;
    TilesToken internal token;
    address internal validator;

    address internal player = makeAddr("player");
    address internal other = makeAddr("other");

    uint8 internal constant DEFAULT_DECIMALS = 18;
    uint256 internal constant DEFAULT_MAX_SCORE = 10_000;
    uint256 internal constant DEFAULT_FUND = 10_000_000 ether;

    uint64 internal constant KNOWN_SEED = 123456789;
    bytes internal constant KNOWN_MOVES = hex"2281a46986247100";
    uint64 internal constant KNOWN_NUM_MOVES = 29;

    uint64 internal constant PROVIDED_SEED = 14898733573372438788;
    bytes
        internal constant PROVIDED_MOVES =
        hex"aaaaaaaaaf34aaaaaaaf7450007072fd284850a24922469502823ccc171757372503d113407101d4c344fffc";
    uint64 internal constant PROVIDED_NUM_MOVES = 175;

    function setUp() public virtual {
        validator = vm.deployCode("out/validator.wasm/foundry.json");
        token = new TilesToken(address(this));
        game = new TilesGame(IValidator(validator), address(token), DEFAULT_DECIMALS, DEFAULT_MAX_SCORE);
        _fundGame(DEFAULT_FUND);
        vm.deal(player, 10 ether);
        vm.deal(other, 10 ether);
    }

    function _fundGame(uint256 amount) internal {
        token.mint(address(game), amount);
    }

    function _deployGame(uint256 maxScore, uint8 decimals) internal returns (TilesGame deployed) {
        deployed = new TilesGame(IValidator(validator), address(token), decimals, maxScore);
    }

    function _validatorScore(uint64 seed, bytes memory moves, uint64 movesLen) internal returns (uint256) {
        return IValidatorHarness(validator).getScore(seed, moves, movesLen);
    }
}
