const ethers = require("ethers");
require("dotenv").config();

async function main() {
  const privateKey = process.env.REACT_APP_DEPOSITOR_PRIVATE_KEY;
  const providerUrl = process.env.REACT_APP_SEPOLIA_URL;

  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  let artifacts = await hre.artifacts.readArtifact("History");

  const factoryHistory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);

  const contractHistory = await factoryHistory.deploy();
  await contractHistory.deployed();
  console.log("History Contract deployed to:", contractHistory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
