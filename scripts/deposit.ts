import { ethers } from "ethers";
import contractAddresses from '../client/src/deployed_addresses.json';  
import { AUSD as AUSDContract, AUSD__factory } from '../typechain-types';
import { FOOBA as foobaContract, FOOBA__factory } from '../typechain-types';
// const deployerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";



async function main() {
    // Connect to the AUSD contract
    // const provider = ethers.provider; // Connect to the local Hardhat network
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const deployerAddress = (await provider.getSigner()).address;
    const ausdContract: AUSDContract = AUSD__factory.connect(contractAddresses['AMM#AUSD'], provider);
    const foobaContract: foobaContract = FOOBA__factory.connect(contractAddresses['AMM#FOOBA'], provider);
    try {
        await ausdContract.connect(await provider.getSigner()).mintTo(deployerAddress, ethers.parseUnits("10000", 18));
        await foobaContract.connect(await provider.getSigner()).mintTo(deployerAddress, ethers.parseUnits("10000", 18));
        const resp = await foobaContract.connect(await provider.getSigner()).balanceOf(deployerAddress);
        console.log("Balance of FOOBA:", resp.toString());
        const resp1 = await ausdContract.connect(await provider.getSigner()).balanceOf(deployerAddress);
        console.log("Balance of AUSD:", resp1.toString());
        
        await ausdContract.connect(await provider.getSigner()).approve(contractAddresses['AMM#AMM'], ethers.parseUnits("10000", 18));
        await foobaContract.connect(await provider.getSigner()).approve(contractAddresses['AMM#AMM'], ethers.parseUnits("10000", 18));
    } catch (error) {
        console.error("Error connecting to the contract:", error);
    }
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});