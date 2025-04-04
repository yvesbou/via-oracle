const chainConfig = {
  "name": "Polygon Mainnet",
  "network": "mainnet",
  "type": "evm",
  "chainId": 137,
  "message": "0x1C5800eb5fECB7760D7F1978ad744feA652a7b27",
  "feeToken": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  "weth": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  "usdc": "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  "rpc": "https://137.rpc.vialabs.io/",
  "explorer": "https://polygonscan.com/",
  "circleTokenMessenger": "0x9daF8c91AEFAE50b9c0E69629D3F6Ca40cA3B3FE",
  "circleMessageTransmitter": "0xF3be9355363857F3e001be68856A2f96b4C39Ba9",
  "circleTokenMinter": "0x10f7835F827D6Cf035115E10c50A853d7FB2D2EC",
  "isCCTPEnabled": true,
  "featureGateway": "0x9bf255FB6C7bbB0e060Ed6CC8996edFB0c4f5e0b",
  "featureCCTP": "0x34d786a3cA75c11cb941840992De0Df2Eb706ad7",
  "protoCCTPGateway": "0x996fCc660B3dF10d547A3A79A75191f1E344c2cb",
  "intentCCTPGateway": "0x0000000000000000000000000000000000000000", // Placeholder address
};

module.exports = chainConfig;