import { ethers } from "ethers";
import DeFiInvestment from "./abis/DeFiInvestment.json";

// Update this with the address from your new deployment
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const abi = DeFiInvestment.abi;

// Use environment variables for RPC URL and Chain ID
const RPC_URL = process.env.REACT_APP_RPC_URL || "http://127.0.0.1:8545";
const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID || "31337");

const getEthereumContract = async () => {
  if (!window.ethereum) {
    console.error("Ethereum wallet not detected");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Add debugging to verify contract connection
    console.log("Connecting to contract at address:", contractAddress);
    console.log(
      "Using ABI with methods:",
      abi.map((item) => item.name).filter((name) => name)
    );

    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract;
  } catch (error) {
    console.error("Error connecting to contract:", error);
    return null;
  }
};

export const getWalletAddress = async () => {
  if (!window.ethereum) return null;
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    console.error("Error getting wallet address:", error);
    return null;
  }
};

export const formatEther = (value) => {
  return ethers.formatEther(value);
};

export const parseEther = (value) => {
  return ethers.parseEther(value);
};

export const investWithGasEstimate = async (contract, amount) => {
  try {
    // Convert amount to BigInt using parseEther
    const valueInWei = parseEther(amount);

    // Estimate gas for the transaction
    const gasEstimate = await contract.invest.estimateGas({
      value: valueInWei,
      gasLimit: 3000000n, // Use BigInt for gasLimit (note the 'n' suffix)
    });

    // Add 20% buffer to the gas estimate - make sure to use BigInt operations
    const gasLimit = (gasEstimate * 120n) / 100n; // This is the correct way to add 20% to a BigInt

    // Execute the transaction with the calculated gas limit
    const tx = await contract.invest({
      value: valueInWei,
      gasLimit: gasLimit,
    });

    return tx;
  } catch (error) {
    console.error("Error in investment with gas estimate:", error);
    throw error;
  }
};

export const verifyNetwork = async () => {
  if (!window.ethereum) return false;

  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const currentChainId = parseInt(chainId, 16);
    console.log("Current chain ID:", currentChainId);

    // Check if connected to the correct network
    if (currentChainId !== CHAIN_ID) {
      console.warn(
        "Not connected to Hardhat local network. Current chain ID:",
        currentChainId
      );

      // Prompt user to switch to Hardhat network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
        });
        return true;
      } catch (switchError) {
        console.error("Error switching to Hardhat network:", switchError);

        // If the network doesn't exist in MetaMask, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${CHAIN_ID.toString(16)}`,
                  chainName: "Hardhat Local",
                  nativeCurrency: {
                    name: "Ethereum",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: [RPC_URL],
                },
              ],
            });
            return true;
          } catch (addError) {
            console.error("Error adding Hardhat network:", addError);
            return false;
          }
        }
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Error verifying network:", error);
    return false;
  }
};

export const verifyContractFunctions = async () => {
  try {
    const contract = await getEthereumContract();
    if (!contract) return false;

    // List of expected functions
    const expectedFunctions = [
      "investments",
      "rewards",
      "yieldFarmingBalances",
      "totalInvested",
      "totalYieldFarming",
      "invest",
      "withdraw",
      "depositYieldFarming",
      "withdrawYieldFarming",
      "getInvestors",
    ];

    // Check each function
    const missingFunctions = [];
    for (const funcName of expectedFunctions) {
      if (typeof contract[funcName] !== "function") {
        missingFunctions.push(funcName);
      }
    }

    if (missingFunctions.length > 0) {
      console.error("Missing contract functions:", missingFunctions);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying contract functions:", error);
    return false;
  }
};

export default getEthereumContract;
