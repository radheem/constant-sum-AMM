import { expect } from "chai";
import { BigNumberish, Contract, Signer } from "ethers";
import hre from "hardhat";
import { ERC20,AUSD, FOOBA, AMM } from "../typechain-types";
import { TEN_TO_POWER_18 } from "../constants";

describe("AMM Contract", function () {
  let AMM, amm, Token, token0, token1, owner, addr1: { address: any; }, addr2;
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    Token = await ethers.getContractFactory("");
    token0 = await Token.deploy("Token0", "TK0", 1000000);
    token1 = await Token.deploy("Token1", "TK1", 1000000);
    await token0.deployed();
    await token1.deployed();

    AMM = await ethers.getContractFactory("AMM");
    amm = await AMM.deploy(token0.address, token1.address);
    await amm.deployed();
  });

  it("Should correctly add liquidity and calculate shares", async function () {
    await token0.transfer(addr1.address, 1000);
    await token1.transfer(addr1.address, 1000);
    
    await token0.connect(addr1).approve(amm.address, 1000);
    await token1.connect(addr1).approve(amm.address, 1000);
    
    await expect(amm.connect(addr1).addLiquidity(100, 100))
      .to.emit(amm, "AddLiquidity")
      .withArgs(addr1.address, 100, 100);
    
    const shares = await amm.getShares();
    expect(shares).to.be.greaterThan(0);
  });

  it("Should correctly calculate swap amounts", async function () {
    await token0.transfer(addr1.address, 1000);
    await token1.transfer(addr1.address, 1000);
    await token0.connect(addr1).approve(amm.address, 1000);
    await token1.connect(addr1).approve(amm.address, 1000);
    await amm.connect(addr1).addLiquidity(500, 500);

    await token0.connect(addr1).approve(amm.address, 100);
    await expect(amm.connect(addr1).swap(token0.address, 100))
      .to.emit(amm, "Swap")
      .withArgs(addr1.address, 100, ethers.BigNumber.from(90));
  });

  it("Should correctly calculate liquidity removal", async function () {
    await token0.transfer(addr1.address, 1000);
    await token1.transfer(addr1.address, 1000);
    await token0.connect(addr1).approve(amm.address, 1000);
    await token1.connect(addr1).approve(amm.address, 1000);
    await amm.connect(addr1).addLiquidity(500, 500);
    const shares = await amm.getShares();

    await expect(amm.connect(addr1).removeLiquidity(shares))
      .to.emit(amm, "RemoveLiquidity")
      .withArgs(addr1.address, 500, 500);
  });
});
