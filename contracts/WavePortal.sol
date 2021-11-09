// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // address of user who waved
        string message; // message from user
        uint256 timestamp; // timestamp when user waved
    }

    // declare variable to store array of structs
    Wave[] waves;

    // associate an address with a number (mapping) store the address with the last time the user waved
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("Another smart contract deployed my boy");

        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        // make sure current timestamp is 15min bigger than the last one
        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
            "Please wait 30 seconds before waving again!"
        );

        // update current timestamp of user
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        // store the wave data in the array
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // generate new seed for next user that sends a wave
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 30) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    //  Returns the struct array waves so we can retrieve values on front end
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
