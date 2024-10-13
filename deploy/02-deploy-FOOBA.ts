// import { HardhatRuntimeEnvironment } from "hardhat/types"
// import { DeployFunction } from "hardhat-deploy/types"
// import {updateJsonFile} from "../helper-functions"
// import { networkConfig, developmentChains } from "../helper-hardhat-config"


// const deployFOOBA: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  
//   const { getNamedAccounts, deployments, network } = hre
//   const { deploy, log } = deployments
//   const { deployer } = await getNamedAccounts()
//   log("----------------------------------------------------")
//   log("Deploying fooba and waiting for confirmations...")
//   const FOOBA = await hre.ethers.getContractFactory("FOOBA");
//   const fooba = await FOOBA.deploy()
//   await fooba.waitForDeployment()
//   const foobaAddress = fooba.getAddress()
//   log(`fooba at ${foobaAddress}`)
//   updateJsonFile(`deployed-contracts/${network.name}.json`, "FOOBA", foobaAddress)
//   log(`completed fooba deployment`)  
// }
// export default deployFOOBA
// deployFOOBA.tags = ["all", "fooba"]