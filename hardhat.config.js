
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require('hardhat-contract-sizer');
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 300
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      hardfork: process.env.CODE_COVERAGE ? "berlin" : "london",
      initialBaseFeePerGas: 0,
      accounts: {
        mnemonic:
          "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish",
        count: 40,
      },
      // forking: {
      //   url: "https://eth-mainnet.alchemyapi.io/v2/7dW8KCqWwKa1vdaitq-SxmKfxWZ4yPG6"
      // },
      allowUnlimitedContractSize: true
    },
    // goerli: {
    //      url: `${process.env.NODE_URL_GOERLI}`,
    //      seeds: [process.env.PRIVATE_KEY],
    //      gas: 10000000 ,
    //      gasPrice: 40000000000
    // }// ,
    // mainnet: {
    //      url: `${process.env.NODE_URL_MAINNET}`,
    //      seeds: [process.env.PRIVATE_KEY],
    //      gas: 3000000 ,
    //      gasPrice: 300000000000
    //    },
    // mumbai: {
    //     url: `${process.env.NODE_URL_MUMBAI}`,
    //     accounts: [process.env.PRIVATE_KEY],
    //     gas: 5000000 ,
    //     gasPrice: 50000000000
    //   }
    // polygon: {
    //   url: `${process.env.NODE_URL_MATIC}`,
    //   seeds: [process.env.PRIVATE_KEY],
    //   gas: 2000000 ,
    //   gasPrice: 250000000000
    // }
    harmony_testnet: {
      url: `${process.env.NODE_URL_HARMONY_TESTNET}`,
      seeds: [process.env.PRIVATE_KEY],
      gas: 2000000 ,
      gasPrice: 250000000000
    }
    // arbitrum_testnet: {
    //   url: `${process.env.NODE_URL_ARBITRUM_TESTNET}`,
    //   seeds: [process.env.PRIVATE_KEY],
    //   gas: 2000000 ,
    //   gasPrice: 250000000000
    // }
    // optimism_testnet: {
    //   url: `${process.env.NODE_URL_OPTIMISM_TESTNET}`,
    //   seeds: [process.env.PRIVATE_KEY],
    //   gas: 2000000 ,
    //   gasPrice: 250000000000
    // }
    ,  pulsev4_testnet: {
      chainId: parseInt(process.env.CHAIN_ID_PULSECHAIN_TESTNET_V4),
      url: `${process.env.NODE_URL_PULSECHAIN_TESTNET_V4}`,
      seeds: [process.env.PRIVATE_KEY],
      gasPrice: 5e10
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN
    // apiKey: process.env.POLYGONSCAN
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  mocha: {
    grep: "@skip-on-coverage", // Find everything with this tag
    invert: true               // Run the grep's inverse set.
  }

}
