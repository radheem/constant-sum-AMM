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
  
    });
  });