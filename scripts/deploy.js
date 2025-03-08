const hre = require("hardhat");

async function main() {
  const DeFiInvestment = await hre.ethers.getContractFactory("DeFiInvestment");
  const defiInvestment = await DeFiInvestment.deploy();

  await defiInvestment.waitForDeployment();

  console.log(
    "DeFiInvestment Contract deployed to:",
    await defiInvestment.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
