import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  
  describe("FOOBA", function () {
    async function deployFOOBA() {
      
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const FOOBA = await hre.ethers.getContractFactory("FOOBA");
      const fooba = await FOOBA.deploy();
      await fooba.waitForDeployment();
  
      return { fooba, owner, otherAccount };
    }
  
    describe("Deployment", function () {
      it("Should set the right unlockTime", async function () {
        const { fooba } = await loadFixture(deployFOOBA);
  
        expect(fooba.deploymentTransaction()).to.not.be.equal(undefined);
      });
  
      it("Should set the right owner", async function () {
        const { fooba, owner } = await loadFixture(deployFOOBA);
        expect(await fooba.getOwner()).to.equal(owner.address);
      });

      it("Should mint 1000 tokens to the owner", async function () {
        const { fooba, owner } = await loadFixture(deployFOOBA);
        const bal:bigint = await fooba.balanceOf(owner.address)
        const depositAmt = BigInt(10**18);
        await fooba.mintTo(owner.address, depositAmt);
        const newBal:bigint = await fooba.balanceOf(owner.address)
        expect(newBal).to.equal(bal + depositAmt);
      });
      it("Should transfer tokens from contract owner address to another", async function () {
        const { fooba, owner, otherAccount } = await loadFixture(deployFOOBA);
        const balOwner:bigint = await fooba.balanceOf(owner.address)
        const balOther:bigint = await fooba.balanceOf(otherAccount.address)
        const depositAmt = BigInt(10**18);
        await fooba.mintTo(owner.address, depositAmt);
        await fooba.transfer(otherAccount.address, depositAmt);
        const newBalOwner:bigint = await fooba.balanceOf(owner.address)
        const newBalOther:bigint = await fooba.balanceOf(otherAccount.address)
        expect(newBalOwner).to.equal(balOwner);
        expect(newBalOther).to.equal(balOther + depositAmt);
      });
    });
  });
