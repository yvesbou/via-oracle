const chainConfig = {
  "name": "sepolia-testnet",
  "network": "testnet",
  "type": "evm",
  "chainId": 11155111,
  "message": "0xF2AA17F92d4D9Be1c0b0D2A3235A06143A2D729f",
  "feeToken": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  "weth": "0x6c884e8b8139a87A68b7c4350a9a25305f6de0b6",
  "usdc": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  "rpc": "https://11155111.rpc.vialabs.io/",
  "explorer": "https://sepolia.etherscan.io/",
  "featureGateway": "0xbf5288c8e8d5A1b89EFC2CefF1836f4c1392507f",
  "featureCCTP": "0x987177924594a83b93aD04C6A57BFB59a78f632E",
  "circleTokenMessenger": "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
  "circleMessageTransmitter": "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
  "circleTokenMinter": "0xE997d7d2F6E065a9A93Fa2175E878Fb9081F1f0A",
  "protoCCTPGateway": "0xC46bc942ca64aed4Eb0B1Af21347944b85EDCb04",
  "isCCTPEnabled": true,
  // This is a root chain for CCTP
  "cctpLeafChains": [
    {
      "chainId": 48899,
      "rootManager": "0xC7c54ca043dC8e5dd1dF6E5a4B4A2Df42A1ba59d",
      "leafManager": "0x31c3E0eeF8412aC4dF12b5C5B0FF25cff2aBA65A"
    }
  ]
};

module.exports = chainConfig;
