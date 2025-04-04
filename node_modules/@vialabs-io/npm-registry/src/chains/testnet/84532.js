const chainConfig = {
  "name": "base-testnet",
  "network": "testnet",
  "type": "evm",
  "chainId": 84532,
  "message": "0xE700Ee5d8B7dEc62987849356821731591c048cF",
  "feeToken": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  "weth": "0x32D9c1DA01F221aa0eab4A0771Aaa8E2344ECd35",
  "usdc": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  "rpc": "https://84532.rpc.vialabs.io/",
  "explorer": "https://sepolia.basescan.org/",
  "featureGateway": "0x9Fc203b5dc5c29912D5c2BEF6ADBC6C8d783ea9B",
  "featureCCTP": "0x2253C9B38aCE84c189FbbCc25535dbA5A0015Ef0",
  "circleTokenMessenger": "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
  "circleMessageTransmitter": "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
  "circleTokenMinter": "0xE997d7d2F6E065a9A93Fa2175E878Fb9081F1f0A",
  "protoCCTPGateway": "0xdcc8769Be2F2E938F02f66e9F8Bb224a81da5Bc9",
  "isCCTPEnabled": true,
  // This is a root chain for CCTP
  "cctpLeafChains": [
    {
      "chainId": 83,
      "rootManager": "0x0553dDfc9A01D200B8608158295157fcBC63479d",
      "leafManager": "0xF58725d7a4c0fBf7978A93772F284e8019Ee8E53"
    },
    {
      "chainId": 325000,
      "rootManager": "0xdBe060aAF22aE343C19A3Be553ddE0623125e552",
      "leafManager": "0x9d1421d5813f6ba074880472D5775e820e18Fd7A"
    },
    {
      "chainId": 41,
      "rootManager": "0xF3Db272879071B64C5a81499b07d2617974dE6B7",
      "leafManager": "0x9d1421d5813f6ba074880472D5775e820e18Fd7A"
    },
    {
      "chainId": 1338,
      "rootManager": "0x500161413B77a8a350755A9d774D3b23B89a4b8B",
      "leafManager": "0xa1cbbf90A38B7C279a1Ef17E29cC61968AaA6945"
    },
    {
      "chainId": 842,
      "rootManager": "0x92D758eD7f324f1821AD01baD68679aE32376110",
      "leafManager": "0x9d1421d5813f6ba074880472D5775e820e18Fd7A"
    }
  ]
};

module.exports = chainConfig;
