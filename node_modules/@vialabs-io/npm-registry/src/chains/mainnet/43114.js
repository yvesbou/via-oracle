const chainConfig = {
  "name": "Avalanche Mainnet",
  "network": "mainnet",
  "type": "evm",
  "chainId": 43114,
  "message": "0x72E052Fa7f0788e668965d37B6c38C88703B7859",
  "feeToken": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  "weth": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  "usdc": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  "eurc": "0xc891eb4cbdeff6e073e859e987815ed1505c2acd",
  "rpc": "https://43114.rpc.vialabs.io/",
  "explorer": "https://snowtrace.io/",
  "circleTokenMessenger": "0x6b25532e1060ce10cc3b0a99e5683b91bfde6982",
  "circleMessageTransmitter": "0x8186359af5f57fbb40c6b14a588d2a59c0c29880",
  "circleTokenMinter": "0x420f5035fd5dc62a167e7e7f08b604335ae272b8",
  "isCCTPEnabled": true,
  "featureGateway": "0x869Ad6620D03F7911ff2565C263235Df4D31f0B6",
  "featureCCTP": "0x9fc67B227F4Fae259A64c9C257C39fB2B62867cD",
  "protoCCTPGateway": "0x8888783155201B84613f1F85623eB7625d3B03c9",
  "intentCCTPGateway": "0x0000000000000000000000000000000000000000", // Placeholder address
  "cctpLeafChains": [
    {
      "chainId": 13939,
      "rootManager": "0x2a4Ff967F8B18DA6F5264Cc6CE5fAB6BDA47eDe8",
      "leafManager": "0xCc7f1f060990360C91D9887D08aD8497FeDd1605"
    }
  ]
};

module.exports = chainConfig;
