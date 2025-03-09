const hre = require("hardhat");

async function main() {
  // Replace with your deployed contract address
  const contractAddress = "0xYourNewContractAddress"; // Use your actual contract address

  try {
    // Get the contract instance
    const contract = await hre.ethers.getContractAt(
      "DeFiInvestment",
      contractAddress
    );

    // Check if the contract has the depositYieldFarming function
    const hasDepositYieldFarming = contract.interface.hasFunction(
      "depositYieldFarming()"
    );
    console.log("Has depositYieldFarming function:", hasDepositYieldFarming);

    // List all functions in the contract
    console.log("\nAll contract functions:");
    Object.keys(contract.interface.functions).forEach((func) => {
      console.log(`- ${func}`);
    });

    // Try to call a view function to verify the contract is accessible
    const owner = await contract.owner();
    console.log("\nContract owner:", owner);
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
