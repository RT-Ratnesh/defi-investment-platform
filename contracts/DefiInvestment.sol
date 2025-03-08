// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DeFiInvestment {
    address public owner;
    mapping(address => uint256) public investments;
    mapping(address => uint256) public rewards;
    address[] public investors; // Store investors separately
    uint256 public totalInvested;

    event Invested(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsDistributed(uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function invest() public payable {
        require(msg.value > 0, "Investment must be greater than 0");

        if (investments[msg.sender] == 0) {
            investors.push(msg.sender); // Add only new investors
        }

        investments[msg.sender] += msg.value;
        totalInvested += msg.value;
        emit Invested(msg.sender, msg.value);
    }

    function calculateReward(address user) internal view returns (uint256) {
        return (investments[user] * 10) / 100; // 10% annual interest (example)
    }

    function distributeRewards() public {
        require(msg.sender == owner, "Only owner can distribute rewards");

        for (uint256 i = 0; i < investors.length; i++) {
            address user = investors[i];
            uint256 reward = calculateReward(user);
            rewards[user] += reward;
        }

        emit RewardsDistributed(totalInvested);
    }

    function withdraw() public {
        uint256 amount = investments[msg.sender] + rewards[msg.sender];
        require(amount > 0, "No funds to withdraw");

        investments[msg.sender] = 0;
        rewards[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, amount);
    }

    function getInvestors() public view returns (address[] memory) {
        return investors;
    }
}