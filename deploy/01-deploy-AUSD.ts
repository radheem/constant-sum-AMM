import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import {updateJsonFile} from "../helper-functions"


const deployAUSD: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    console.log(`Deploying AUSD...${hre.version}`);
  const [deployer] = await hre.ethers.getSigners();
  const AUSD = await hre.ethers.getContractFactory("AUSD");
  const ausd = await AUSD.deploy()
  await ausd.deployed()
  console.log("AUSD deployed to:", ausd.address);
  const ausdAddress = ausd.getAddress()
  updateJsonFile(`./deployed-contracts.json`, "AUSD", ausdAddress)

    // Optionally mint tokens to the deployer
    const mintAmount = ethers.utils.parseUnits('1000', 18); // Mint 1000 AUSD tokens
    const tx = await ausd.mintTo(deployer.address, mintAmount);

    // Wait for the mint transaction to be mined
    await tx.wait();

    console.log(`Minted 1000 AUSD to deployer address: ${deployer.address}`);  
}
export default deployAUSD
deployAUSD.tags = ["all", "ausd"]

