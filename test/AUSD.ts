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
  
    });
  });