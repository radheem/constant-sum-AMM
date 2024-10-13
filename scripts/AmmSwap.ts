import { ethers } from "hardhat";
import wallets from "../addresses.json";
import { BigNumber } from "ethers";

async function main() {
  // Convert 10 to BigNumber representing 10 AUSD tokens (with 18 decimals)
  const transferAmount = 10;
  const value: BigNumber = ethers.utils.parseUnits(transferAmount.toString(), 18); // 10 AUSD tokens (18 decimals)
  
  const ausd = await ethers.getContract("FOOBA");
  const amm = await ethers.getContract("AMM");
  
  // Approve AMM contract to spend AUSD tokens on behalf of the user
  const approveTx = await ausd.approve(amm.address, value);
  await approveTx.wait();  // Wait for the transaction to be mined
  console.log(`Approval Transaction hash: ${approveTx.hash}`);
  
  // Call the swap function with 10 AUSD tokens
  const swapTx = await amm.swap(ausd.address, value);
  await swapTx.wait();  // Wait for the transaction to be mined
  console.log(`Swap Transaction hash: ${swapTx.hash}`);

  const result = await amm.getReserves()
  console.log(`AUSD Reserve: ${result}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
