const chainConfig = {
  "name": "arbitrum-sepolia",
  "network": "testnet",
  "type": "evm",
  "chainId": 421614,
  "message": "0x0D7e59B0390e47E6C3a29cCdF68e43f3e50e2119",
  "feeToken": "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  "weth": "0x47963cB18B1aef899efcdC5EF7341B5167e5d4E0",
  "usdc": "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  "rpc": "https://421614.rpc.vialabs.io/",
  "explorer": "https://sepolia.arbiscan.io/",
  "featureGateway": "0x176c9Eb7aabC9A9857E6a08980b463b6C6FE0486",
  "featureCCTP": "0x761fC9166a95f686e55B66C397d04C0889c5c92F",
  "circleTokenMessenger": "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
  "circleMessageTransmitter": "0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872",
  "circleTokenMinter": "0xE997d7d2F6E065a9A93Fa2175E878Fb9081F1f0A",
  "protoCCTPGateway": "0x040F70B724F1E7f8509848e750bbF10e20b73f60",
  "isCCTPEnabled": true,
  // This is a root chain for CCTP
  "cctpLeafChains": [
    {
      "chainId": 997,
      "rootManager": "0x448811d70486296d4e2B60E4258328957C94EaA7",
      "leafManager": "0x28d03e97e68Fb138a2318A2627806dfAF9972755"
    },
    {
      "chainId": 37714555429,
      "rootManager": "0x46bFafc74f8dD1FC4c8Ea963ac881504Ba75D5fD",
      "leafManager": "0x9d1421d5813f6ba074880472D5775e820e18Fd7A"
    },
    {
      "chainId": 5115,
      "rootManager": "0x610F32033567097454cE0DF669Abc949Fb2f256B",
      "leafManager": "0x2660b88B931aE3b8dBcb796F3038305C46eb7F88"
    },
    {
      "chainId": 7210,
      "rootManager": "0xdc61e66FaFc8D7F1293D8d31C2068D2E4692428D",
      "leafManager": "0xAD1837d07c5e4396cD57491Fd3B4eCfa3aD7f5E5"
    },
    {
      "chainId": 689,
      "rootManager": "0xad1A3c80492e6E1e1ad115020B0270EEc4C52457",
      "leafManager": "0x9d1421d5813f6ba074880472D5775e820e18Fd7A",
    },
    {
      "chainId": 6911,
      "rootManager": "0xf17a03bD8d9F641Ff2344B9FB5d786DDb62D09B8",
      "leafManager": "0xFb78F049683D3EdC0808a03297df9da8f2633315",
    },
  ]
};

module.exports = chainConfig;
