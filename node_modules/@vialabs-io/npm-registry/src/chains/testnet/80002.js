const chainConfig = {
  "name": "polygon-amoy",
  "network": "testnet",
  "type": "evm",
  "chainId": 80002,
  "message": "0x3B5b764229b2EdE0162220aF51ab6bf7f8527a4F",
  "feeToken": "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
  "weth": "0x0EFafca24E5BbC1C01587B659226B9d600fd671f",
  "usdc": "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
  "rpc": "https://80002.rpc.vialabs.io/",
  "explorer": "https://mumbai.polygonscan.com/",
  "featureGateway": "0x9Fe535E31A20A9dFe5D66CE47dbb2fB69ea63Ab9",
  "featureCCTP": "0x2661237BFEc9d09b7cbca3AA01361f1C2650705d",
  "circleTokenMessenger": "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
  "circleMessageTransmitter": "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
  "circleTokenMinter": "0xE997d7d2F6E065a9A93Fa2175E878Fb9081F1f0A",
  "protoCCTPGateway": "0x9803cdfd229ac9c33839F4aAF4a13A276a789c24",
  "isCCTPEnabled": true,
  "cctpLeafChains": [
    {
      "chainId": 65100004,
      "rootManager": "0x1EdAbc528261A942e58eD1e02E4c5C849a9F7cdD",
      "leafManager": "0x9d1421d5813f6ba074880472D5775e820e18Fd7A"
    }
  ]
};

module.exports = chainConfig;
