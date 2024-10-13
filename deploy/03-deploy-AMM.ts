// import { HardhatRuntimeEnvironment } from "hardhat/types"
// import { DeployFunction } from "hardhat-deploy/types"
// import { networkConfig, developmentChains } from "../helper-hardhat-config"
// import { readJsonFile, updateJsonFile } from "../helper-functions"
// import { ethers } from "ethers"

// const deployAMM: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//     const { getNamedAccounts, deployments, network } = hre
//     const { deploy, log } = deployments
//     const { deployer } = await getNamedAccounts()
//     const AUSD = await hre.ethers.getContractFactory("AUSD");
//     const FOOBA = await hre.ethers.getContractFactory("FOOBA");
//     const AMM = await hre.ethers.getContractFactory("AMM");
//     const addresses = readJsonFile(`deployed-contracts/${network.name}.json`)
//     const ausd = AUSD.attach(addresses.AUSD);
//     const fooba = FOOBA.attach(addresses.FOOBA);
    
    
//     log("----------------------------------------------------")
//     log("Deploying AMM and waiting for confirmations...")
//     const ammDeploy = await AMM.deploy({
//         from: deployer,
//         args: [addresses.AUSD, addresses.FOOBA],
//         log: true,
//     })
//     await ammDeploy.waitForDeployment()
//     const ammAddress = ammDeploy.getAddress()
//     updateJsonFile(`deployed-contracts/${network.name}.json`, "AMM", ammAddress)
//     log(`AMM at ${ammAddress}`)
    
//     const ammLiquidityAmount = process.env.AMM_LIQUIDITY_AMOUNT || 1000;
//     const liquidityValue: ethers.BigNumberish = ethers.parseUnits(ammLiquidityAmount.toString(), 18);
    
    
//     // Approve AMM contract to spend AUSD tokens on behalf of the user
//     let approveTx = await ausd.approve(amm.address, liquidityValue);
//     await approveTx.wait();  // Wait for the transaction to be mined
//     console.log(`AUSD Approval Hash: ${approveTx.hash}`);
    
//     approveTx = await fooba.approve(amm.address, liquidityValue);
//     await approveTx.wait();  
//     console.log(`FOOBA Approval Hash: ${approveTx.hash}`);
    
//     const swapTx = await amm.addLiquidity(liquidityValue, liquidityValue);
//     await swapTx.wait();  
//     console.log(`Swap Transaction hash: ${swapTx.hash}`);
//     log(`completed AMM deployment`)  
// }

// export default deployAMM
// deployAMM.tags = ["all", "amm"]