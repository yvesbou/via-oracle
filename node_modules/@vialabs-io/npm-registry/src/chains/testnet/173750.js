const chainConfig = {
  "name": "avalanche-echo-testnet",
  "network": "testnet",
  "type": "evm",
  "chainId": 173750,
  "message": "0x0000000000000000000000000000000000000000", // @note Not deployed by design
  "feeToken": "0x2777023E33B88CE622B15eCfA4ADa3cb5a9C545f",
  "usdc": "0x2777023E33B88CE622B15eCfA4ADa3cb5a9C545f",
  "weth": "0x8228407F8bc38790997616B18AF8773016270558", // @note Temporary mock weth
  "protoCCTPGateway": "0x3C615A128acb9E3247d4CF24CaA0a987d3816754",
};

module.exports = chainConfig;