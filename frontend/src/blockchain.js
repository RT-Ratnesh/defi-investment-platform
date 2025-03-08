import { ethers } from "ethers";
import DeFiInvestment from "./abis/DeFiInvestment.json";

const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const abi = DeFiInvestment.abi;

const getEthereumContract = async () => {
  if (!window.ethereum) {
    console.error("Ethereum wallet not detected");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
  } catch (error) {
    console.error("Error connecting to contract:", error);
    return null;
  }
};

export default getEthereumContract;
