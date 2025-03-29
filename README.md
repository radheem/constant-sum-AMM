# Constant Sum Automated Market Maker (AMM)

A Constant Sum Automated Market Maker (AMM) is a decentralized exchange mechanism that maintains liquidity using a constant sum formula, differing from the more prevalent constant product models like Uniswap. The defining equation for a constant sum AMM is:


```
x + y = k
```


Here, `x` and `y` represent the quantities of two different tokens in the liquidity pool, and `k` is a constant representing the total combined quantity of these tokens. This linear relationship ensures that the sum of the token reserves remains unchanged during trades.

## Key Features

1. **Linear Pricing**: The price remains constant for any trade, unlike constant product AMMs where the price varies based on liquidity depth. This results in zero slippage for trades.

2. **No Impermanent Loss**: Since the price doesn't change with trades, liquidity providers (LPs) are not exposed to impermanent loss, which is common in other AMM models.

3. **Optimal for Stable Assets**: This model is particularly suitable for trading assets that are meant to maintain a stable value relative to each other, such as stablecoins. However, it is less effective when reserves are depleted, as it can lead to arbitrage opportunities that may drain the pool.

4. **Zero Slippage**: Large trades do not impact the price, making it capital efficient in low-volatility environments.

## Repository Overview

This repository provides tools and scripts to:

1. **Set Up a Local Hardhat Blockchain**: Initialize a local Ethereum-like development environment using Hardhat.

2. **Deploy Contracts**: Deploy a Constant Sum AMM contract along with two ERC20 token contracts to the local blockchain.

3. **Interact with the AMM**: Utilize a client interface to interact with the deployed AMM contract, facilitating operations such as adding liquidity, swapping tokens, and removing liquidity.

4. **Connect via MetaMask**: Configure and use the MetaMask wallet to interact with the local blockchain and deployed contracts.

## Setup Instructions

Follow these steps to set up and run the project:

1. **Install Dependencies**:

   ```shell
   yarn install
   ```


2. **Compile Contracts**:

   ```shell
   yarn hardhat compile
   ```


## Running Tests

To execute the test suite and ensure all components are functioning correctly:


```shell
yarn hardhat test
```


## Deploying Locally

1. **Start the Hardhat Node**:

   ```shell
   yarn hardhat node
   ```


2. **Deploy Contracts**:

   ```shell
   yarn deploy_local
   ```


3. **Configure Client**:

   - Copy the `deployed_addresses.json` file from `./ignition/deployments/<network>/` to `./client/src`.

4. **Fund Accounts**:

   ```shell
   yarn fund
   ```


5. **Approve Allowance for AMM**:

   ```shell
   yarn allowance
   ```


6. **Add Initial Liquidity**:

   ```shell
   yarn add_liquidity
   ```


7. **Set Up Client**:

   - Navigate to the client directory:

     ```shell
     cd client
     ```

   - Install client dependencies:

     ```shell
     yarn
     ```

   - Return to the root directory:

     ```shell
     cd ..
     ```

8. **Start Client**:

   ```shell
   yarn start_client
   ```


## Interacting with the AMM

Once the client is running:

- **Access the Interface**: Open the provided local URL in your web browser.

- **Connect MetaMask**: Ensure your MetaMask wallet is connected to the local Hardhat network.

- **Perform Actions**: Use the interface to add or remove liquidity, swap tokens, and observe the constant sum behavior of the AMM.

## Notes

- **MetaMask Configuration**: You may need to manually add the local Hardhat network to MetaMask and import the deployed token contracts using their addresses from the `deployed_addresses.json` file.

- **Hardhat Accounts**: The Hardhat node provides predefined accounts with known private keys, which can be used for testing purposes.

- **Further Reading**: For a deeper understanding of constant sum AMMs and their mathematical foundations, refer to [The AMM Book](https://theammbook.org/formulas/constantsum_csmm/).

--- 
