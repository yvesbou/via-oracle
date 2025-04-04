const chainConfig = {
  "name": "avalanche-dispatch-testnet",
  "network": "testnet",
  "type": "evm",
  "chainId": 779672,
  "message": "0x0000000000000000000000000000000000000000", // @note Not deployed by design
  "feeToken": "0x0e80E22b69C48CcDC54B4D0A24D497d8203B7b1E",
  "usdc": "0x0e80E22b69C48CcDC54B4D0A24D497d8203B7b1E",
  "weth": "0xA68E53100d11611F11A8956818F9Bd3DD3A2eE8d", // @note Temporary mock weth
  "protoCCTPGateway": "0x144c21008a6e31291aAADec4CAc09c73bc640Fb4",
};

module.exports = chainConfig;