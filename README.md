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
In another terminal run
```shell
yarn hardhat ignition deploy ./ignition/modules/AMM.ts --network localhost
```

copy the `./ignition/deployments/<name-of-your-chain>/deployed_addresses.json` to `./client/src` 