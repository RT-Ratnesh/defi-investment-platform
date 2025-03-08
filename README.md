# DeFi Investment Platform

A decentralized finance platform that allows users to invest ETH and earn rewards.

## Project Structure

- `contracts/`: Contains Solidity smart contracts
- `frontend/`: React-based web application
- `scripts/`: Deployment scripts for smart contracts

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask browser extension
- Hardhat for local blockchain development

## Setup and Installation

### Smart Contract Deployment

1. Install dependencies:

```bash
npm install
```

2. Compile the smart contracts:

```bash
npx hardhat compile
```

3. Start a local Hardhat node:

```bash
npx hardhat node
```

4. In a new terminal, deploy the contracts to the local network:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

5. Copy the deployed contract address and update it in `frontend/src/blockchain.js`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and navigate to http://localhost:3000

## Using the DApp

1. Connect your MetaMask wallet to the application
2. Make sure MetaMask is connected to the correct network (localhost:8545 for local development)
3. Use the interface to invest ETH, view investors, and withdraw funds

## Smart Contract Functions

- `invest()`: Invest ETH into the platform
- `withdraw()`: Withdraw your investment plus any rewards
- `distributeRewards()`: Owner-only function to distribute rewards to investors
- `getInvestors()`: View all investors' addresses

## Troubleshooting

- If you encounter issues with MetaMask, try resetting your account in MetaMask settings
- Make sure your contract address in `frontend/src/blockchain.js` matches the deployed contract address
- For local development, make sure to add the Hardhat network to MetaMask (Network Name: Hardhat, RPC URL: http://127.0.0.1:8545, Chain ID: 31337)

## License

MIT
