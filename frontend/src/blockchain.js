import { ethers } from "ethers";
import DeFiInvestment from "./abis/DeFiInvestment.json"; // ✅ Updated import

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // ✅ Your contract address
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

// ✅ Ensure the function is exported correctly
export default getEthereumContract;
