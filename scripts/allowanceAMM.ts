import { ethers } from "ethers";
// import FOOBA from '../client/src/contractABIs/FOOBA.json';
// import AUSD from '../client/src/contractABIs/AUSD.json';
import AMM from '../client/src/contractABIs/AMM.json';
import contractAddresses from '../client/src/deployed_addresses.json';  
import { AUSD as AUSDContract, AUSD__factory } from '../typechain-types';
import { FOOBA as foobaContract, FOOBA__factory } from '../typechain-types';

async function main() {
    // Connect to the AUSD contract
    // const provider = ethers.provider; // Connect to the local Hardhat network
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    const ausdContract: AUSDContract = AUSD__factory.connect(contractAddresses['AMM#AUSD'], provider);
    const foobaContract: foobaContract = FOOBA__factory.connect(contractAddresses['AMM#FOOBA'], provider);
    // const ammContract = new ethers.Contract(contractAddresses['AMM#AMM'], AMM.abi, provider);
    try {
        ausdContract.connect(await provider.getSigner()).approve(contractAddresses['AMM#AMM'], ethers.parseUnits("10000", 18));
        foobaContract.connect(await provider.getSigner()).approve(contractAddresses['AMM#AMM'], ethers.parseUnits("10000", 18));
    } catch (error) {
        console.error("Error connecting to the contract:", error);
    }
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});