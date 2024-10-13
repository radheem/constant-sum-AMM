import { ethers } from "hardhat";

async function main() {
  const debug = true;  
  const ausd = await ethers.getContract("AUSD");

  if (debug) {
    ausd.on("*", (event) => {
      console.log(`Event detected:
        Event Name: ${event.event}
        Event Signature: ${event.eventSignature}
        Args: ${JSON.stringify(event.args)}
        Transaction Hash: ${event.transactionHash}`);
    });

    console.log("Listening for all events in debug mode...");
  } else {
    ausd.on("Transfer", (from, to, value, event) => {
      console.log(`Transfer event detected:
        From: ${from}
        To: ${to}
        Value: ${ethers.utils.formatUnits(value, 18)} AUSD
        Transaction Hash: ${event.transactionHash}`);
    });

    console.log("Listening for Transfer events...");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
