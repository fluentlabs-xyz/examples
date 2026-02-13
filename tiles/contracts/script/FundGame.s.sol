// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {TilesToken} from "../src/TilesToken.sol";

contract FundGame is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        address tilesTokenAddress = vm.envAddress("TILES_TOKEN_ADDRESS");
        address tilesGameAddress = vm.envAddress("TILES_GAME_ADDRESS");

        uint256 fundTokens = vm.envOr("FUND_TOKENS", uint256(10_000_000));
        uint256 fundEthWei = vm.envOr("FUND_ETH_WEI", uint256(1 ether));

        TilesToken token = TilesToken(tilesTokenAddress);
        uint256 tokenAmountWei = fundTokens * 1e18;

        vm.startBroadcast(deployerKey);

        token.mint(tilesGameAddress, tokenAmountWei);

        (bool sent,) = payable(tilesGameAddress).call{value: fundEthWei}("");
        require(sent, "ETH transfer failed");

        vm.stopBroadcast();

        console2.log("Funded game contract:", tilesGameAddress);
        console2.log("Minted tokens (wei):", tokenAmountWei);
        console2.log("Sent ETH (wei):", fundEthWei);
        console2.log("Game token balance:", token.balanceOf(tilesGameAddress));
        console2.log("Game ETH balance:", tilesGameAddress.balance);
    }
}
