const chainConfig = {
  "name": "Base Mainnet",
  "network": "mainnet",
  "type": "evm",
  "chainId": 8453,
  "message": "0xe3b3274bb685F37C7f17a604039c77a6A16Cfc2a",
  "feeToken": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "weth": "0x4200000000000000000000000000000000000006",
  "usdc": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "rpc": "https://8453.rpc.vialabs.io/",
  "explorer": "https://basescan.org/",
  "circleTokenMessenger": "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962",
  "circleMessageTransmitter": "0xAD09780d193884d503182aD4588450C416D6F9D4",
  "circleTokenMinter": "0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6",
  "isCCTPEnabled": true,
  "featureGateway": "0x9A9b54a7b63361743531C52E5f7fa2d4BD3fD33e",
  "featureCCTP": "0x29451F0ee3Ef946b49598232928E98b30c6f255A",
  "protoCCTPGateway": "0x804FD8228bc5A02db6CdA3fFa96a9C6b6D49b1e7",
  "intentCCTPGateway": "0x0000000000000000000000000000000000000000", // Placeholder address
  "cctpLeafChains": [
    {
      "chainId": 40,
      "rootManager": "0xbEc2085d80E71969625E8b497Bc3d66a2f665D99",
      "leafManager": "0x9e0517ADAEc365Af770F67F7e83055d60Ad7D4dc"
    }
  ]
};

module.exports = chainConfig;