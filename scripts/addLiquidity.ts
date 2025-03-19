import { ethers, Signer } from "ethers";
import hre from "hardhat";
import contractAddresses from '../client/src/deployed_addresses.json';  
import { AMM as AMMContract, AMM__factory } from '../typechain-types';
const deployerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";



async function main() {
    // Connect to the localchain
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const c = (await provider.getSigner()).address;
    console.log("Address: ", c);
    const ammContract: AMMContract = AMM__factory.connect(contractAddresses['AMM#AMM'], provider); 
    try {
        await ammContract.connect(await provider.getSigner()).addLiquidity(ethers.parseUnits("1000", 18),ethers.parseUnits("1000", 18));
        const balances = await ammContract.getBalance();
        console.log("AMM contract balances: Fooba: ", balances[1], " AUSD: ", balances[0]);
    } catch (error) {
        console.error("Error connecting to the contract:", error);
    }
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});