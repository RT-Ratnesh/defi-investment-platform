import { ethers } from "ethers";
import DeFiInvestment from "./abis/DeFiInvestment.json";

const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
const abi = DeFiInvestment.abi;

const getEthereumContract = async () => {
  if (!window.ethereum) {
    console.error("Ethereum wallet not detected");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
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

export default getEthereumContract;
