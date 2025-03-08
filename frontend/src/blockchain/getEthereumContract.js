import { ethers } from "ethers";
import contractABI from "./contractABI.json"; // Ensure ABI is correctly imported
const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Replace with actual deployed address

export const getEthereumContract = async () => {
  if (!window.ethereum) return null;

  const provider = new ethers.BrowserProvider(window.ethereum); // For reading data
  const signer = await provider.getSigner(); // For transactions
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  return contract;
};
