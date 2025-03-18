import { ethers } from "ethers";
import FOOBA from '../client/src/contractABIs/FOOBA.json';
import AUSD from '../client/src/contractABIs/AUSD.json';
import AMM from '../client/src/contractABIs/AMM.json';
import contractAddresses from '../client/src/deployed_addresses.json';  


async function main() {
    // Connect to the AUSD contract
    // const provider = ethers.provider; // Connect to the local Hardhat network
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    const ausdContract = new ethers.Contract(contractAddresses['AMM#AUSD'], AUSD.abi, provider);
    const foobaContract = new ethers.Contract(contractAddresses['AMM#FOOBA'], FOOBA.abi, provider);
    const ammContract = new ethers.Contract(contractAddresses['AMM#AMM'], AMM.abi, provider);
    try {
    // Call the getOwner function
        const owner = await ausdContract.getOwner();
        console.log("Owner of AUSD contract:", owner);
        const owner2 = await foobaContract.getOwner();
        console.log("Owner of FOOBA contract:", owner2);
        const balances = await ammContract.getBalance();
        console.log("AMM contract balances: Fooba: ", balances[0], " AUSD: ", balances[1]);
    } catch (error) {
        console.error("Error connecting to the contract:", error);
    }
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});