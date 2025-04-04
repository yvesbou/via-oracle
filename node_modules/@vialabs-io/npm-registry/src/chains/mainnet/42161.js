const chainConfig = {
  "name": "Arbitrum Mainnet",
  "network": "mainnet",
  "type": "evm",
  "chainId": 42161,
  "message": "0x65EEc58ef38882422E887B82f7085e9a9C35dCA1",
  "feeToken": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  "weth": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  "usdc": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  "rpc": "https://42161.rpc.vialabs.io/",
  "explorer": "https://arbiscan.io/",
  "circleTokenMessenger": "0x19330d10D9Cc8751218eaf51E8885D058642E08A",
  "circleMessageTransmitter": "0xC30362313FBBA5cf9163F0bb16a0e01f01A896ca",
  "circleTokenMinter": "0xE7Ed1fa7f45D05C508232aa32649D89b73b8bA48",
  "isCCTPEnabled": true,
  "featureGateway": "0x88eC0180180Af475430eb6e8F38981cb0b61F93d",
  "featureCCTP": "0x5a596d81cF8911818F3231eb87a77Ac1426485Bf",
  "protoCCTPGateway": "0x3b05FC65F04489538619EBCe0661f29597DA8df2",
  "intentCCTPGateway": "0x0000000000000000000000000000000000000000", // Placeholder address
  "cctpLeafChains": [
    {
      "chainId": 660279,
      "rootManager": "0x482fEC83988a57f7B853EBE3927Edbd49DBF44BC",
      "leafManager": "0x9e0517ADAEc365Af770F67F7e83055d60Ad7D4dc"
    },
    {
      "chainId": 995,
      "rootManager": "0x56f6f2A23AE5EF82D8Dc46934F7Cf8D0b15ddEdD",
      "leafManager": "0xA5895cB2F28579a1B002c524DB7A5250EE6A5773"
    },
    {
      "chainId": 6900,
      "rootManager": "0x30af901F0F031Da450AB6f0AB695185690E10c91",
      "leafManager": "0x1c0e7F1967aB417e7363112500d770BCCBf18BbD"
    },
    {
      "chainId": 1689,
      "rootManager": "0x4C1e3c449Eb89EbB4D3813C6ccf618Ea8Ee48E25",
      "leafManager": "0x9e0517ADAEc365Af770F67F7e83055d60Ad7D4dc"
    }
  ]
};

module.exports = chainConfig;
