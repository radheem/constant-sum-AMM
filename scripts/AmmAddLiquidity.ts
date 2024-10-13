import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {
  // Convert 10 to BigNumber representing 10 AUSD tokens (with 18 decimals)
  const transferAmount = 50;
  const liquidityValue: BigNumber = ethers.utils.parseUnits(transferAmount.toString(), 18); // 10 AUSD tokens (18 decimals)
  
  const fooba = await ethers.getContract("FOOBA");
  const ausd = await ethers.getContract("AUSD");
  const amm = await ethers.getContract("AMM");
  
  // Approve AMM contract to spend AUSD tokens on behalf of the user
  let approveTx = await ausd.approve(amm.address, liquidityValue);
  await approveTx.wait();  // Wait for the transaction to be mined
  console.log(`AUSD Approval Hash: ${approveTx.hash}`);
  
  approveTx = await fooba.approve(amm.address, liquidityValue);
  await approveTx.wait();  
  console.log(`FOOBA Approval Hash: ${approveTx.hash}`);
  
  const swapTx = await amm.addLiquidity(liquidityValue, liquidityValue);
  await swapTx.wait();  
  console.log(`Swap Transaction hash: ${swapTx.hash}`);

  const result = await amm.getReserves()
  console.log(`AUSD Reserve: ${result}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
