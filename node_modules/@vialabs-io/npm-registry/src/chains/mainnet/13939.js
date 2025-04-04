const chainConfig = {
  "name": "reef-mainnet",
  "network": "mainnet",
  "type": "reef",
  "chainId": 13939,
  "message": "0xdAFcF1e328c09cbc480A09f751c170CfCca3e083",
  "messageSubstrate": "5EMjsd1648TVgor7qD19pXda8mbfbDZ3NyTRUiWKZBRmPZ7e",
  "protoCCTPGateway": "0x54A83CE0165988C4259Ce5ecF6F17692a0700A9F",
  "feeToken": "0xCA2917E6625E158be8066e8D8a584B022AB6D8D6",
  "usdc": "0xCA2917E6625E158be8066e8D8a584B022AB6D8D6",
  "weth": "0x0000000000000000000000000000000001000000" // @note unwrap weth MUST BE FALSE!
};

module.exports = chainConfig;
