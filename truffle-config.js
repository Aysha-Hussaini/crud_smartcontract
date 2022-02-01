const fs = require('fs');
const path = require('path');
var HDWalletProvider = require("@truffle/hdwallet-provider");
const secrets = JSON.parse(
  fs.readFileSync('.secrets').toString().trim()
);
module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    ropsten:{
      provider : () => 
        new HDWalletProvider (
          secrets.seed,
          `https://ropsten.infura.io/v3/${secrets.projectId}`
        ),
      network_id: 3
    }
  }
};
