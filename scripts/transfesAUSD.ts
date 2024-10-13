import { ethers } from "hardhat";
import wallets from "../addresses.json";

async function main() {
  const transferAmount = 10;
  const ausd = await ethers.getContract("AUSD");
  
  const decimals = await ausd.decimals();
  
  // get balances of user 0 and user 1
  const value = (await ausd.balanceOf(wallets[0].address))/10**decimals;
  console.log(`Balance of User 0 before transaction: ${value.toString()}`);
  
  const value1 = (await ausd.balanceOf(wallets[1].address))/10**decimals;
  console.log(`Balance of User 1 before transaction: ${value1.toString()}`);

  if (value < 10) {
    throw new Error("Insufficient balance in user 0 account");
  }
  const transferAmountbBigInt = ethers.utils.parseUnits(transferAmount.toLocaleString(), decimals); // Transfer 10 AUSD

  const resp = await ausd.transfer(wallets[1].address, transferAmountbBigInt);
  console.log(`Transaction hash: ${resp.hash}`);

  const user0Balance = (await ausd.balanceOf(wallets[0].address))/10**decimals;
  console.log(`User 0 balance after transfer: ${user0Balance.toString()}`);

  const user1Balance = (await ausd.balanceOf(wallets[1].address))/10**decimals;
  console.log(`User 1 balance after transfer: ${user1Balance.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
