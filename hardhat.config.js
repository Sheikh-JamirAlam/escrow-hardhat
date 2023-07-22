require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: process.env.REACT_APP_SEPOLIA_URL,
      accounts: [process.env.REACT_APP_DEPOSITOR_PRIVATE_KEY],
    },
  },
  paths: {
    artifacts: "./app/src/artifacts",
  },
};
