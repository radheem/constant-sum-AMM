# Constant SUM AMM
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