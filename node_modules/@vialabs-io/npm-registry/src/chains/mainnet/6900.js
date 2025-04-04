const chainConfig = {
  "name": "Nibiru Mainnet",
  "network": "mainnet",
  "type": "evm",
  "chainId": 6900,
  "message": "0x15AC559DA4951c796DB6620fAb286B96840D039A",
  "feeToken": "0x08EBA8ff53c6ee5d37A90eD4b5239f2F85e7B291",
  "usdc": "0x08EBA8ff53c6ee5d37A90eD4b5239f2F85e7B291",
  "protoCCTPGateway": "0x844f9248EA80Ee65F633a7Fa82Af78643d63834C",
  // "weth": "0x7D4B7B8CA7E1a24928Bb96D59249c7a5bd1DfBe6",
  "weth": "0x1429B38e58b97de646ACd65fdb8a4502c2131484" // @note this is some temporary WETH, while we wait for Nibiru to get back to us. We DID NOT deploy this, it's result #2 on Google when searching WNIBI
};

module.exports = chainConfig;
