import { ethers } from "ethers";

async function getBlockchainInfo() {
    // Connect to local Hardhat blockchain (or other local network)
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log(`Latest Block Number: ${latestBlock}`);

    // Get the chain ID (network ID)
    const network = await provider.getNetwork();
    console.log(`Chain ID: ${network.chainId}`);
    console.log(`Network Name: ${network.name}`);

    // Get the latest block details
    const block = await provider.getBlock(latestBlock);
    console.log(`Latest Block Hash: ${block.hash}`);
    console.log(`Latest Block Timestamp: ${new Date(block.timestamp * 1000).toISOString()}`);
    
    // Get the gas price
    const gasPrice = await provider.getGasPrice();
    console.log(`Gas Price: ${ethers.utils.formatUnits(gasPrice, "gwei")} Gwei`);

    // Get the list of accounts (if the local blockchain exposes any)
    const accounts = await provider.listAccounts();
    console.log(`Accounts: ${accounts.join(", ")}`);
}

getBlockchainInfo().catch((error) => {
    console.error("Error fetching blockchain info:", error);
});
