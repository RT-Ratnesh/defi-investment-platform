const hre = require("hardhat");

async function main() {
  // Replace with your deployed contract address
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Use your actual contract address

  try {
    // Get the contract instance
    const contract = await hre.ethers.getContractAt(
      "DeFiInvestment",
      contractAddress
    );

    // Get a signer
    const [signer] = await hre.ethers.getSigners();
    console.log("Testing with account:", signer.address);

    // Check contract balance
    const balance = await hre.ethers.provider.getBalance(contractAddress);
    console.log("Contract balance:", hre.ethers.formatEther(balance), "ETH");

    // Try to deposit a small amount
    console.log("Attempting to deposit 0.01 ETH for yield farming...");
    const tx = await contract.depositYieldFarming({
      value: hre.ethers.parseEther("0.01"),
    });

    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Deposit successful!");

    // Check updated balances
    const userYieldBalance = await contract.yieldFarmingBalances(
      signer.address
    );
    console.log(
      "User yield farming balance:",
      hre.ethers.formatEther(userYieldBalance),
      "ETH"
    );

    const totalYieldFarming = await contract.totalYieldFarming();
    console.log(
      "Total yield farming:",
      hre.ethers.formatEther(totalYieldFarming),
      "ETH"
    );
  } catch (error) {
    console.error("Error testing contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
