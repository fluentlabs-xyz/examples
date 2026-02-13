// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {TilesGame} from "../../src/TilesGame.sol";
import {IValidator} from "../../out/validator.wasm/interface.sol";
import {BaseTilesGameTest} from "./Base.t.sol";

contract TilesGameInitializationTest is BaseTilesGameTest {
    function test_constructor_revertsWhenValidatorIsZero() public {
        vm.expectRevert(bytes("Validator address cannot be zero"));
        new TilesGame(IValidator(address(0)), address(token), DEFAULT_DECIMALS, DEFAULT_MAX_SCORE);
    }

    function test_constructor_revertsWhenTokenIsZero() public {
        vm.expectRevert(bytes("Token address cannot be zero"));
        new TilesGame(IValidator(validator), address(0), DEFAULT_DECIMALS, DEFAULT_MAX_SCORE);
    }

    function test_constructor_setsInitialState() public view {
        assertEq(address(game.validator()), validator);
        assertEq(address(game.token()), address(token));
        assertEq(game.owner(), address(this));
        assertEq(game.tokenDecimals(), DEFAULT_DECIMALS);
        assertEq(game.maxScore(), DEFAULT_MAX_SCORE);
    }

    function test_constructor_initialUsedSeedIsFalse() public view {
        assertFalse(game.usedSeeds(KNOWN_SEED));
        assertFalse(game.usedSeeds(PROVIDED_SEED));
    }
}
