// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const fs = require('fs');
// const MNEMONIC = fs.readFileSync(".env").toString().trim();

require('dotenv').config();
const { MNEMONIC } = process.env;

const HDWalletProvider = require('@truffle/hdwallet-provider');

console.log(MNEMONIC);
module.exports = {
  networks: {
    // development: {
    //   host: "127.0.0.1",     // Localhost (default: none)
    //   port: 8545,            // Standard Ethereum port (default: none)
    //   network_id: "*",       // Any network (default: none)
    // },
    matic: {
      
      provider: () => new HDWalletProvider(MNEMONIC, `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
      confirmations: 2,
      skipDryRun: true,
      timeoutBlocks: 200,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
	version: "0.8.19"
    }
  }
}