/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-truffle5')
require("solidity-coverage")
require('solidity-docgen')
module.exports = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: true
        }
      },
      viaIR: false
    }
  }
}
