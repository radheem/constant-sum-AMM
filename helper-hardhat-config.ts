
export const developmentChains = ["hardhat", "localhost"]
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

export interface networkConfigItem {
    ethUsdPriceFeed?: string
    blockConfirmations?: number
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    localhost: {},
    hardhat: {},
    sepolia: {
      blockConfirmations: 6,
    },
}