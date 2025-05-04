async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Finvest = await ethers.getContractFactory("Finvest");
  const finvest = await Finvest.deploy(deployer.address);
  console.log("Contract deployed, waiting for confirmation...");

  // Wait for deployment to be confirmed
  await finvest.deployTransaction.wait(1);

  console.log("Finvest deployed to:", finvest.address);
}

main().catch((error) => {
  console.error("Error deploying contract:", error);
  process.exitCode = 1;
});


//contract address : 0x0cd118073a8ff6026ae465621664b277e32e2843