// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {stdJson} from "forge-std/StdJson.sol";
import {ChessPuzzle} from "../src/ChessPuzzle.sol";
import {FluentEloToken} from "../src/FluentEloToken.sol";

contract CreatePuzzles is Script {
    using stdJson for string;

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address gameMaster = vm.addr(deployerKey);

        address eloTokenAddress = vm.envAddress("ELO_TOKEN_ADDRESS");
        address chessPuzzleAddress = vm.envAddress("CHESS_PUZZLE_ADDRESS");
        uint256 rewardTokens = vm.envOr("PUZZLE_REWARD", uint256(1000));

        // Read puzzles from generated JSON file
        string memory json = vm.readFile("puzzles.json");
        string[] memory fens = json.readStringArray(".fens");

        uint256 rewardAmount = rewardTokens * 1e18;
        uint256 totalReward = rewardAmount * fens.length;

        FluentEloToken eloToken = FluentEloToken(eloTokenAddress);
        ChessPuzzle chessPuzzle = ChessPuzzle(chessPuzzleAddress);

        console2.log("Puzzles to create:", fens.length);
        console2.log("Reward per puzzle:", rewardTokens, "tokens");
        console2.log("Total tokens needed:", rewardTokens * fens.length);

        vm.startBroadcast(deployerKey);

        eloToken.mint(gameMaster, totalReward);
        eloToken.approve(chessPuzzleAddress, totalReward);

        uint256 created = 0;
        for (uint256 i = 0; i < fens.length; i++) {
            try chessPuzzle.createPuzzle(fens[i], rewardAmount, eloTokenAddress) {
                console2.log("  [OK]", fens[i]);
                created++;
            } catch Error(string memory reason) {
                console2.log("  [SKIP]", fens[i], reason);
            } catch {
                console2.log("  [FAIL]", fens[i]);
            }
        }

        vm.stopBroadcast();

        console2.log("---");
        console2.log("Created:", created, "/", fens.length);
    }
}
