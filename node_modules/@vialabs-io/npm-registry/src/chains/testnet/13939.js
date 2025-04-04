const chainConfig = {
  "name": "reef-testnet",
  "network": "testnet",
  "type": "reef",
  "chainId": 13939,
  "message": "0xf7af4C3ecA8Dd2E2a59eD44060537a09f701C6ed",
  "messageSubstrate": "5EMjsd1BodbqwQ6S71CigZuz2oprqP9GQmPJDVKZCCF1cKc6",
  "feeToken": "0x72761eBBA6395D6deE4A8e273c1E487a72693c46",
  "weth": "0x0000000000000000000000000000000001000000" // @note unwrap weth MUST BE FALSE!
};

module.exports = chainConfig;