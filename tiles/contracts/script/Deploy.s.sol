// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {TilesGame} from "../src/TilesGame.sol";
import {TilesToken} from "../src/TilesToken.sol";
import {IValidator} from "../out/validator.wasm/interface.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        uint256 maxScore = vm.envOr("MAX_SCORE", uint256(10000));
        uint8 tokenDecimals = uint8(vm.envOr("TOKEN_DECIMALS", uint256(18)));

        vm.startBroadcast(deployerKey);

        TilesToken token = new TilesToken(deployer);
        console2.log("TilesToken deployed at:", address(token));

        bytes memory wasmBytecode = vm.getCode("out/validator.wasm/foundry.json");
        console2.log("WASM bytecode size:", wasmBytecode.length);

        address validatorAddress;
        assembly {
            validatorAddress := create(0, add(wasmBytecode, 0x20), mload(wasmBytecode))
        }
        require(validatorAddress != address(0), "Validator deployment failed");
        console2.log("Validator deployed at:", validatorAddress);

        TilesGame game = new TilesGame(IValidator(validatorAddress), address(token), tokenDecimals, maxScore);
        console2.log("TilesGame deployed at:", address(game));

        vm.stopBroadcast();
    }
}
