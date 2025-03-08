import { ethers } from "ethers";
import contractABI from "../artifacts/contracts/DeFiInvestment.sol/DeFiInvestment.json";

const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const getEthereumContract = () => {
  const { ethereum } = window;
  if (!ethereum) {
    console.log("MetaMask not found!");
    return null;
  }
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI.abi, signer);
};

export default getEthereumContract;
