import { expect } from "chai";
import hre, { ethers } from "hardhat";

interface User {
  address: string;
  privateKey: string;
  balance: string;
}
describe("ausd", function () {
  let user1:User;
  it("Should set the right unlockTime", async function () {
    const ausd = await hre.ethers.deployContract("AUSD");
    const decimals = await ausd.decimals();
    const resp = ethers.Wallet.createRandom()
    const mintResp = await ausd.mintTo(resp.address, ethers.toBigInt(10**18));
    console.log(mintResp);
    const balance = await ausd.balanceOf(resp.address);
    console.log(balance);
    expect(balance).to.equal(ethers.toBigInt(10**18));
  });
});