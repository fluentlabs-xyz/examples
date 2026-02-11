// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {ChessPuzzle} from "../src/ChessPuzzle.sol";
import {FluentEloToken} from "../src/FluentEloToken.sol";
import {ICheckmateValidator} from "../out/checkmate-validator.wasm/interface.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        // Deploy FluentEloToken
        FluentEloToken token = new FluentEloToken(deployer);
        console2.log("FluentEloToken deployed at:", address(token));

        // Deploy WASM CheckmateValidator
        bytes memory wasmBytecode = vm.getCode("out/checkmate-validator.wasm/foundry.json");
        console2.log("WASM bytecode size:", wasmBytecode.length);

        address checkmateValidator;
        assembly {
            checkmateValidator := create(0, add(wasmBytecode, 0x20), mload(wasmBytecode))
        }
        require(checkmateValidator != address(0), "CheckmateValidator deployment failed");
        console2.log("CheckmateValidator deployed at:", checkmateValidator);

        // Deploy ChessPuzzle
        ChessPuzzle puzzle = new ChessPuzzle(ICheckmateValidator(checkmateValidator));
        console2.log("ChessPuzzle deployed at:", address(puzzle));

        vm.stopBroadcast();
    }
}
