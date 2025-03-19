# Constant SUM AMM
A constant sum AMM (Automated Market Maker) is a type of AMM that maintains liquidity using a constant sum formula instead of a constant product (like Uniswap). The formula is:
```text
x+y=k
```
## Key Features
1. Linear Pricing – The price remains constant for any trade, unlike constant product AMMs where price changes dynamically based on liquidity depth.
2. No Impermanent Loss – Since the price doesn't change, LPs don't suffer impermanent loss.
3. Better for Stable Assets – Works well for assets meant to be pegged (e.g., stablecoins) but fails when reserves deplete, leading to arbitrage risks.
4. Zero Slippage – Large trades do not impact the price, making it capital efficient in low volatility environments.

## This Repo allows you to....
1. Setup a local hardhat chain
2. Deploy an AMM and two ERC20 tokens 
3. Run a client and interact with the AMM contract 
4. Connect using Metamask wallet

## Setup 
```shell
yarn install
```

```shell
yarn hardhat compile
```
## Running Tests 
```shell
yarn hardhat test
``` 

## Deploying locally
```shell
yarn hardhat node
``` 
### Setting up 
1. Deploying contracts 
    ```shell
    yarn deploy_local
    ```
2. Copy the `./ignition/deployments/<name-of-your-chain>/deployed_addresses.json` to `./client/src`
3. Fund the account  
    ```shell
    yarn fund 
    ```
4. Approve allowance for AMM
    ```shell
    yarn allowance
    ```
5. Add initial liquidity
    ```shell
    yarn add_liquidity
    ```
6. Setup client, cd into client forlder, run
    ```shell
    yarn 
    ```
7. Come back to root and start client 
    ```shell
    yarn start_client 
    ```