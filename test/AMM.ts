import { expect } from "chai";
import { BigNumberish, Contract, Signer } from "ethers";
import hre from "hardhat";
import { ERC20,AUSD, FOOBA, AMM } from "../typechain-types";
import { TEN_TO_POWER_18 } from "../constants";

describe("AMM", function () {
  let token0: AUSD;
  let token1: FOOBA;
  let amm: AMM;
  let deployer: Signer;
  let user1: Signer;
  let user2: Signer;

  beforeEach(async () => {
    // Get the signers
    [deployer, user1, user2] = await hre.ethers.getSigners();

    // Deploy ERC20 tokens (AUSD and FOOBA)
    const AUSD = await hre.ethers.getContractFactory("AUSD");
    token0 = await AUSD.deploy();
    await token0.waitForDeployment();
    const FOOBA = await hre.ethers.getContractFactory("FOOBA");
    token1 = await FOOBA.deploy();
    await token1.waitForDeployment();
    // Mint tokens to deployer and users
    await token0.mintTo(await deployer.getAddress(), hre.ethers.parseUnits("10000", 18));
    await token1.mintTo(await deployer.getAddress(), hre.ethers.parseUnits("10000", 18));
    await token0.mintTo(await user1.getAddress(), hre.ethers.parseUnits("1000", 18));
    await token1.mintTo(await user1.getAddress(), hre.ethers.parseUnits("1000", 18));

    // Deploy the AMM contract
    const AMM = await hre.ethers.getContractFactory("AMM");
    amm = await AMM.deploy(token0.getAddress(), token1.getAddress());

    // Approve AMM to spend user tokens
    await token0.connect(deployer).approve(amm.getAddress(), hre.ethers.parseUnits("10000", 18));
    await token1.connect(deployer).approve(amm.getAddress(), hre.ethers.parseUnits("10000", 18));
    await token0.connect(user1).approve(amm.getAddress(), hre.ethers.parseUnits("1000", 18));
    await token1.connect(user1).approve(amm.getAddress(), hre.ethers.parseUnits("1000", 18));
  });

  it("should add liquidity with intiali supply 0", async function () {
    const amounIn = 1000
    const amount0 = hre.ethers.parseUnits(amounIn.toString(), 18);
    const amount1 = hre.ethers.parseUnits(amounIn.toString(), 18);
    const resp = await amm.addLiquidity(amount0, amount1);

    // Add liquidity to the AMM
    await expect(resp)
      .to.emit(amm, "AddLiquidity")
      .withArgs(await deployer.getAddress(), amount0, amount1);

    const reserves = await amm.getReserves();
    expect(reserves[0]).to.equal(amount0);
    expect(reserves[1]).to.equal(amount1);

    const sharesResp = await amm.balanceOf(await deployer.getAddress());
    expect(sharesResp.toString()).to.be.equal(hre.ethers.parseUnits(amounIn.toString(), 18));
  });

  it("should swap tokens", async function () {
    const reserveAmount = BigInt(1000*10**18);
    
    // Add liquidity first
    await amm.addLiquidity(reserveAmount,reserveAmount);
    const amountIn:bigint = BigInt(100*TEN_TO_POWER_18)
    
    // amountInWithFee = amountIn - ( 0.3 % of amountIn)
    const amountInWithFee = (amountIn * BigInt(997*TEN_TO_POWER_18)) / BigInt(1000*TEN_TO_POWER_18);
    
    const amountOut = (reserveAmount * amountInWithFee) / (reserveAmount + amountInWithFee);

    // Swap Token0 for Token1
    await expect(amm.connect(user1).swap(token0.getAddress(), amountIn))
      .to.emit(amm, "Swap")
      .withArgs(await user1.getAddress(), amountIn, amountOut);

    const reserves = await amm.getReserves();
    expect(reserves[0]).to.be.gt(reserveAmount);
    expect(reserves[1]).to.be.lt(reserveAmount);
  });

  it("should remove liquidity", async function () {
    const reserveAmount = BigInt(1000*TEN_TO_POWER_18);
    // Add liquidity
    await amm.addLiquidity(reserveAmount, reserveAmount);

    const shares = await amm.balanceOf(await deployer.getAddress());
    
    const amount0 = (shares * reserveAmount) / reserveAmount;
    const amount1 = (shares * reserveAmount) / reserveAmount;
    
    // Remove liquidity
    await expect(amm.removeLiquidity(shares))
      .to.emit(amm, "RemoveLiquidity")
      .withArgs(await deployer.getAddress(), amount0, amount1);

    // both reserves should be 0
    const reserves = await amm.getReserves();
    expect(reserves[0]).to.equal(0);
    expect(reserves[1]).to.equal(0);
  });
});
