const chainConfig = {
  "name": "Ethereum Mainnet",
  "network": "mainnet",
  "type": "evm",
  "chainId": 1,
  "message": "0x7b67dF6728E294db2eb173ac7c738a4627Ae5e11",
  "feeToken": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "weth": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "usdc": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "eurc": "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
  "rpc": "https://1.rpc.vialabs.io/",
  "explorer": "https://etherscan.io/",
  "circleTokenMessenger": "0xbd3fa81b58ba92a82136038b25adec7066af3155",
  "circleMessageTransmitter": "0x0a992d191deec32afe36203ad87d7d289a738f81",
  "circleTokenMinter": "0xc4922d64a24675e16e1586e3e3aa56c06fabe907",
  "isCCTPEnabled": true,
  "featureGateway": "0xba30eFc4F2553d0A7733D2CA3cEc98cDC4D428ba",
  "featureCCTP": "0x31f840D4cFB05F2B72C41B501d6dd1CFe4106aa6",
  "protoCCTPGateway": "0x53f67b67418dcFB5ca88D443ee82584148b3c973",
  "intentCCTPGateway": "0x0000000000000000000000000000000000000000", // Placeholder address
  "cctpLeafChains": [
    {
      "chainId": 48900,
      "rootManager": "0x3012C9175ef181Fb8Da827cc439cd88861cf6aaB",
      "leafManager": "0x3fBD26bd2F4ea70042634ac10972C3E3DeaCd875"
    }
  ]
};

module.exports = chainConfig;
