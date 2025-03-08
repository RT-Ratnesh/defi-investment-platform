// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DeFiInvestment {
    address public owner;
    mapping(address => uint256) public investments;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public stakingBalances;
    mapping(address => uint256) public stakingTimestamps;
    mapping(address => uint256) public yieldFarmingBalances;
    mapping(address => uint256) public lastYieldClaimTime;
    
    address[] public investors; // Store investors separately
    uint256 public totalInvested;
    uint256 public totalStaked;
    uint256 public totalYieldFarming;
    
    uint256 public constant STAKING_APY = 12; // 12% APY for staking
    uint256 public constant YIELD_FARMING_APY = 18; // 18% APY for yield farming
    uint256 public constant BASIC_INVESTMENT_APY = 10; // 10% APY for basic investment
    uint256 public constant SECONDS_IN_YEAR = 31536000; // 365 days

    event Invested(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsDistributed(uint256 amount);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event YieldFarmingDeposited(address indexed user, uint256 amount);
    event YieldFarmingWithdrawn(address indexed user, uint256 amount);
    event YieldClaimed(address indexed user, uint256 amount);

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

    function stake() public payable {
        require(msg.value > 0, "Staking amount must be greater than 0");
        
        if (investments[msg.sender] == 0 && stakingBalances[msg.sender] == 0) {
            investors.push(msg.sender); // Add only new investors
        }
        
        stakingBalances[msg.sender] += msg.value;
        stakingTimestamps[msg.sender] = block.timestamp;
        totalStaked += msg.value;
        
        emit Staked(msg.sender, msg.value);
    }
    
    function unstake() public {
        uint256 stakedAmount = stakingBalances[msg.sender];
        require(stakedAmount > 0, "No staked balance");
        
        uint256 stakingDuration = block.timestamp - stakingTimestamps[msg.sender];
        uint256 reward = calculateStakingReward(msg.sender, stakingDuration);
        
        stakingBalances[msg.sender] = 0;
        totalStaked -= stakedAmount;
        
        uint256 totalAmount = stakedAmount + reward;
        payable(msg.sender).transfer(totalAmount);
        
        emit Unstaked(msg.sender, totalAmount);
    }
    
    function depositYieldFarming() public payable {
        require(msg.value > 0, "Yield farming deposit must be greater than 0");
        
        if (investments[msg.sender] == 0 && yieldFarmingBalances[msg.sender] == 0) {
            investors.push(msg.sender);
        }
        
        yieldFarmingBalances[msg.sender] += msg.value;
        lastYieldClaimTime[msg.sender] = block.timestamp;
        totalYieldFarming += msg.value;
        
        emit YieldFarmingDeposited(msg.sender, msg.value);
    }
    
    function withdrawYieldFarming() public {
        uint256 farmingAmount = yieldFarmingBalances[msg.sender];
        require(farmingAmount > 0, "No yield farming balance");
        
        uint256 farmingDuration = block.timestamp - lastYieldClaimTime[msg.sender];
        uint256 yield = calculateYieldFarmingReward(msg.sender, farmingDuration);
        
        yieldFarmingBalances[msg.sender] = 0;
        totalYieldFarming -= farmingAmount;
        
        uint256 totalAmount = farmingAmount + yield;
        payable(msg.sender).transfer(totalAmount);
        
        emit YieldFarmingWithdrawn(msg.sender, totalAmount);
    }
    
    function claimYield() public {
        uint256 farmingAmount = yieldFarmingBalances[msg.sender];
        require(farmingAmount > 0, "No yield farming balance");
        
        uint256 farmingDuration = block.timestamp - lastYieldClaimTime[msg.sender];
        uint256 yield = calculateYieldFarmingReward(msg.sender, farmingDuration);
        require(yield > 0, "No yield to claim");
        
        lastYieldClaimTime[msg.sender] = block.timestamp;
        
        payable(msg.sender).transfer(yield);
        
        emit YieldClaimed(msg.sender, yield);
    }

    function calculateStakingReward(address user, uint256 duration) internal view returns (uint256) {
        return (stakingBalances[user] * STAKING_APY * duration) / (100 * SECONDS_IN_YEAR);
    }
    
    function calculateYieldFarmingReward(address user, uint256 duration) internal view returns (uint256) {
        return (yieldFarmingBalances[user] * YIELD_FARMING_APY * duration) / (100 * SECONDS_IN_YEAR);
    }

    function calculateReward(address user) internal view returns (uint256) {
        return (investments[user] * BASIC_INVESTMENT_APY) / 100; // 10% annual interest
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
    
    function getUserPortfolio(address user) public view returns (
        uint256 basicInvestment,
        uint256 yieldFarmingBalance,
        uint256 pendingRewards,
        uint256 pendingYieldFarmingRewards
    ) {
        uint256 farmingDuration = block.timestamp - lastYieldClaimTime[user];
        
        return (
            investments[user],
            yieldFarmingBalances[user],
            rewards[user],
            calculateYieldFarmingReward(user, farmingDuration)
        );
    }
    
    function getTotalPortfolioValue(address user) public view returns (uint256) {
        (
            uint256 basicInvestment,
            uint256 yieldFarmingBalance,
            uint256 pendingRewards,
            uint256 pendingYieldFarmingRewards
        ) = getUserPortfolio(user);
        
        return basicInvestment + yieldFarmingBalance + pendingRewards + pendingYieldFarmingRewards;
    }
}