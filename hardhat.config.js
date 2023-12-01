require('dotenv').config()
require('solidity-coverage')
require('solidity-docgen')
require('@openzeppelin/hardhat-upgrades')
require('@nomiclabs/hardhat-etherscan')
require('@nomicfoundation/hardhat-chai-matchers')

module.exports = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
      chainId: 1
    },
    ganache: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337
    },
    live: {
      url: 'http://178.25.19.88:80',
      chainId: 1
      // Add other optional config values here
    },
    goerli: {
      url: process.env.GOERLI_NODE,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5
    },
    polygon: {
      url: process.env.POLYGON_NODE,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 137,
      gasPrice: 450000000000
    },
    mainnet: {
      url: process.env.MAINNET_NODE,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1
    }
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY
    }
  }
}
