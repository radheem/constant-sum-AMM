import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
    local: {
      url: "http://localhost:8545",
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
  },
};

task("addLiquidity", "Adds liquidity to the AMM")
  .addParam("contractAddress", "The address of the AMM contract")
  .addParam("liquidityValue", "The amount of liquidity to add in wei")
  .setAction(async (taskArgs, hre) => {
    const { contractAddress, liquidityValue } = taskArgs;
    const [signer] = await hre.ethers.getSigners(); // get the first signer account (the deployer)

    const contract = await hre.ethers.getContractAt("AMM", contractAddress);

    const tx = await contract.connect(signer).addLiquidity(
      hre.ethers.parseEther(liquidityValue), // AUSD
      hre.ethers.parseEther(liquidityValue) // FOOBA
      );

    console.log(`Adding ${liquidityValue} ETH as liquidity`);
    await tx.wait();
    console.log("Liquidity added successfully!");
  });

  task("removeLiquidity", "Removes liquidity from the AMM")
  .addParam("contractAddress", "The address of the AMM contract")
  .addParam("liquidityValue", "The amount of liquidity to remove in wei")
  .setAction(async (taskArgs, hre) => {
    const { contractAddress, liquidityValue } = taskArgs;
    const [signer] = await hre.ethers.getSigners();

    const contract = await hre.ethers.getContractAt("AMM", contractAddress);

    const tx = await contract.connect(signer).removeLiquidity(hre.ethers.parseEther(liquidityValue));

    console.log(`Removing ${liquidityValue} ETH liquidity`);
    await tx.wait();
    console.log("Liquidity removed successfully!");
  });


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
export default config;
