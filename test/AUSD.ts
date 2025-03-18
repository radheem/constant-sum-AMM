import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre from "hardhat";
  
  describe("AUSD", function () {
    async function deployAUSD() {
      
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const AUSD = await hre.ethers.getContractFactory("AUSD");
      const ausd = await AUSD.deploy();
      await ausd.waitForDeployment();
  
      return { ausd, owner, otherAccount };
    }
  
    describe("Deployment", function () {
      it("Should set the right unlockTime", async function () {
        const { ausd } = await loadFixture(deployAUSD);
  
        expect(ausd.deploymentTransaction()).to.not.be.equal(undefined);
      });
  
      it("Should set the right owner", async function () {
        const { ausd, owner } = await loadFixture(deployAUSD);
        expect(await ausd.getOwner()).to.equal(owner.address);
      });

      it("Should mint 1000 tokens to the owner", async function () {
        const { ausd, owner } = await loadFixture(deployAUSD);
        const bal:bigint = await ausd.balanceOf(owner.address)
        const depositAmt = BigInt(10**18);
        await ausd.mintTo(owner.address, depositAmt);
        const newBal:bigint = await ausd.balanceOf(owner.address)
        expect(newBal).to.equal(bal + depositAmt);
      });
      it("Should transfer tokens from contract owner address to another", async function () {  
        const { ausd, owner, otherAccount } = await loadFixture(deployAUSD);
        const balOwner:bigint = await ausd.balanceOf(owner.address)
        const balOther:bigint = await ausd.balanceOf(otherAccount.address)
        const depositAmt = BigInt(10**18);
        await ausd.mintTo(owner.address, depositAmt);
        await ausd.transfer(otherAccount.address, depositAmt);
        const newBalOwner:bigint = await ausd.balanceOf(owner.address)
        const newBalOther:bigint = await ausd.balanceOf(otherAccount.address)
        expect(newBalOwner).to.equal(balOwner);
        expect(newBalOther).to.equal(balOther + depositAmt);
      });
    });
  });