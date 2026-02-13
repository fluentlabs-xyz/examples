// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {TilesGame} from "../../src/TilesGame.sol";
import {IValidator} from "../../out/validator.wasm/interface.sol";
import {BaseTilesGameTest} from "./Base.t.sol";
import {Vm} from "forge-std/Vm.sol";

contract TilesGamePlayGameTest is BaseTilesGameTest {
    event GamePlayed(
        address indexed player,
        uint64 seed,
        uint256 score,
        uint256 tokensTransferred
    );

    function test_playGame_rewardsPlayerWithRealValidatorScore() public {
        uint256 score = _validatorScore(
            KNOWN_SEED,
            KNOWN_MOVES,
            KNOWN_NUM_MOVES
        );
        assertGt(score, 0, "known fixture should produce positive score");
        assertLe(
            score,
            game.maxScore(),
            "known fixture should be uncapped in default setup"
        );

        uint256 expectedPayout = score * (10 ** uint256(game.tokenDecimals()));

        vm.prank(player);
        game.playGame(KNOWN_SEED, KNOWN_MOVES, KNOWN_NUM_MOVES);

        assertEq(token.balanceOf(player), expectedPayout);
        assertTrue(game.usedSeeds(KNOWN_SEED));
    }

    function test_playGame_capsRewardByMaxScore() public {
        uint256 lowCap = 10;
        TilesGame cappedGame = _deployGame(lowCap, DEFAULT_DECIMALS);
        token.mint(address(cappedGame), 1_000_000 ether);

        uint256 score = _validatorScore(
            KNOWN_SEED,
            KNOWN_MOVES,
            KNOWN_NUM_MOVES
        );
        assertGt(score, lowCap, "fixture must exceed cap for this test");

        vm.prank(player);
        cappedGame.playGame(KNOWN_SEED, KNOWN_MOVES, KNOWN_NUM_MOVES);

        uint256 expectedPayout = lowCap * 10 ** uint256(DEFAULT_DECIMALS);
        assertEq(token.balanceOf(player), expectedPayout);
    }

    function test_playGame_revertsWhenSeedAlreadyUsed() public {
        vm.startPrank(player);
        game.playGame(KNOWN_SEED, KNOWN_MOVES, KNOWN_NUM_MOVES);
        vm.expectRevert(bytes("Seed already used"));
        game.playGame(KNOWN_SEED, KNOWN_MOVES, KNOWN_NUM_MOVES);
        vm.stopPrank();
    }

    function test_playGame_revertsWhenMovesEmpty() public {
        vm.prank(player);
        vm.expectRevert(bytes("Moves cannot be empty"));
        game.playGame(KNOWN_SEED, bytes(""), 0);
    }

    function test_playGame_revertsWhenScoreIsZero() public {
        bytes memory nonEmptyMoves = hex"01";
        uint64 zeroScoreNumMoves = 0;

        uint256 score = _validatorScore(
            KNOWN_SEED,
            nonEmptyMoves,
            zeroScoreNumMoves
        );
        assertEq(score, 0, "fixture should produce zero score");

        vm.prank(player);
        vm.expectRevert(bytes("Invalid score"));
        game.playGame(KNOWN_SEED, nonEmptyMoves, zeroScoreNumMoves);
        assertFalse(game.usedSeeds(KNOWN_SEED));
    }

    function test_playGame_revertsWhenGameHasInsufficientTokenBalance() public {
        uint256 gameBalance = token.balanceOf(address(game));
        game.transferToken(address(this), gameBalance);

        vm.prank(player);
        vm.expectRevert(bytes("Not enough tokens in the contract"));
        game.playGame(KNOWN_SEED, KNOWN_MOVES, KNOWN_NUM_MOVES);
    }

    function test_playGame_reproducesProvidedInputTuple() public {
        uint256 score = _validatorScore(
            PROVIDED_SEED,
            PROVIDED_MOVES,
            PROVIDED_NUM_MOVES
        );

        if (score == 0) {
            vm.prank(player);
            vm.expectRevert(bytes("Invalid score"));
            game.playGame(PROVIDED_SEED, PROVIDED_MOVES, PROVIDED_NUM_MOVES);
            assertFalse(game.usedSeeds(PROVIDED_SEED));
            return;
        }

        uint256 appliedScore = score > game.maxScore()
            ? game.maxScore()
            : score;
        uint256 expectedPayout = appliedScore *
            (10 ** uint256(game.tokenDecimals()));
        uint256 balanceBefore = token.balanceOf(player);

        vm.prank(player);
        game.playGame(PROVIDED_SEED, PROVIDED_MOVES, PROVIDED_NUM_MOVES);

        assertEq(token.balanceOf(player), balanceBefore + expectedPayout);
        assertTrue(game.usedSeeds(PROVIDED_SEED));
    }

    function test_playGameSelectorFailsWhenSentToValidatorAddress() public {
        bytes memory payload = abi.encodeWithSelector(
            TilesGame.playGame.selector,
            PROVIDED_SEED,
            PROVIDED_MOVES,
            PROVIDED_NUM_MOVES
        );

        (bool ok, bytes memory ret) = validator.call(payload);
        assertFalse(
            ok,
            "playGame selector must fail when sent to validator address"
        );

        if (ret.length >= 4) {
            bytes4 returnedSelector;
            assembly {
                returnedSelector := mload(add(ret, 0x20))
            }
            assertTrue(
                returnedSelector == TilesGame.playGame.selector ||
                    returnedSelector != bytes4(0),
                "unexpected empty selector prefix"
            );
        }
    }
}
