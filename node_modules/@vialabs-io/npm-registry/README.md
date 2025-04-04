# @vialabs-io/npm-registry

This package contains blockchain-related configurations and utilities for cross-chain communication and management. It provides a centralized source of chain configurations and helper functions for developers working with multiple blockchain networks.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Available Functions](#available-functions)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)
- [Dependencies](#dependencies)
- [Related Packages](#related-packages)
- [License](#license)
- [Support](#support)
- [Troubleshooting](#troubleshooting)

## Installation

Since this package is hosted on GitHub, you can install it using:

```bash
npm install github:VIALabs-io/npm-registry
```

Or add it to your package.json:

```json
{
  "dependencies": {
    "@vialabs-io/npm-registry": "github:VIALabs-io/npm-registry"
  }
}
```

## Usage

Import and use the configurations and functions in your TypeScript files:

```typescript
import { 
  ChainConfig,
  getChainConfig, 
  isTestnet, 
  getProtoCCTPGateway, 
  getIntentCCTPGateway 
} from "@vialabs-io/npm-registry";

// Get chain configuration with proper typing
const config: ChainConfig = getChainConfig(1); // Ethereum Mainnet
console.log(config.name); // "Ethereum"

// Check if a chain is a testnet with type safety
const isTestNet: boolean = isTestnet(5); // true for Goerli testnet

// Get CCTP Gateway addresses with proper return types
const protoCCTPGateway: string | undefined = getProtoCCTPGateway(1);
const intentCCTPGateway: string | undefined = getIntentCCTPGateway(1);

// Example of using with async/await
async function getChainDetails(chainId: number): Promise<void> {
  const config = getChainConfig(chainId);
  if (!config) {
    throw new Error(`Chain ID ${chainId} not supported`);
  }
  
  console.log({
    name: config.name,
    network: config.network,
    isTestnet: isTestnet(chainId),
    protoCCTPGateway: getProtoCCTPGateway(chainId),
    intentCCTPGateway: getIntentCCTPGateway(chainId)
  });
}
```

## Configuration

The chain configuration object follows this TypeScript interface:

```typescript
interface ChainConfig {
  name: string;           // Human-readable chain name
  network: string;        // Network type (mainnet/testnet)
  chainId: number;        // Unique chain identifier
  type: string;          // Chain type (e.g., 'evm')
  protoCCTPGateway?: string;    // Proto CCTP Gateway address
  intentCCTPGateway?: string;   // Intent CCTP Gateway address
  message?: string;             // Message contract address
  feeToken?: string;           // Fee token address
  weth?: string;               // Wrapped native token address
  rpc?: string;               // RPC endpoint
  explorer?: string;          // Block explorer URL
  circleTokenMessanger?: string;  // Circle token messenger address
  circleMessageTransmitter?: string; // Circle message transmitter
  circleTokenMinter?: string;      // Circle token minter address
  usdc?: string;                  // USDC token address
  eurc?: string;                  // EURC token address
  featureGateway?: string;        // Feature gateway address
}
```

Example configuration for Ethereum Mainnet:

```typescript
const ethereumConfig: ChainConfig = {
  name: "Ethereum Mainnet",
  network: "mainnet",
  type: "evm",
  chainId: 1,
  message: "0x7b67dF6728E294db2eb173ac7c738a4627Ae5e11",
  feeToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  circleTokenMessanger: "0xbd3fa81b58ba92a82136038b25adec7066af3155",
  circleMessageTransmitter: "0x0a992d191deec32afe36203ad87d7d289a738f81",
  circleTokenMinter: "0xc4922d64a24675e16e1586e3e3aa56c06fabe907",
  weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  eurc: "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
  rpc: "https://1.rpc.vialabs.io/",
  explorer: "https://etherscan.io/"
};
```

## Available Functions

1. `getChainConfig(chainId: number): ChainConfig | undefined`
   - Returns the configuration for a specific chain.
   - Usage:
     ```typescript
     const config: ChainConfig | undefined = getChainConfig(1);
     if (config) {
       console.log(config.name); // "Ethereum Mainnet"
     }
     ```

2. `isTestnet(chainId: number): boolean`
   - Determines if a given chain ID belongs to a testnet.
   - Usage:
     ```typescript
     const isGoerliTestnet: boolean = isTestnet(5);
     console.log(isGoerliTestnet); // true
     ```

3. `getProtoCCTPGateway(chainId: number): string | undefined`
   - Returns the Proto CCTP Gateway address for a given chain ID.
   - Usage:
     ```typescript
     const protoCCTPGateway: string | undefined = getProtoCCTPGateway(1);
     if (protoCCTPGateway) {
       console.log(protoCCTPGateway); // "0x..."
     }
     ```

4. `getIntentCCTPGateway(chainId: number): string | undefined`
   - Returns the Intent CCTP Gateway address for a given chain ID.
   - Usage:
     ```typescript
     const intentCCTPGateway: string | undefined = getIntentCCTPGateway(1);
     if (intentCCTPGateway) {
       console.log(intentCCTPGateway); // "0x..."
     }
     ```

## Project Structure

```
npm-registry/
├── src/
│   ├── index.ts              # Main entry point
│   ├── types/                # TypeScript type definitions
│   │   └── chain.ts          # Chain configuration types
│   └── chains/              # Chain configurations
│       ├── mainnet/         # Mainnet chain configs
│       └── testnet/         # Testnet chain configs
├── tests/                   # Test files
├── scripts/                 # Build and utility scripts
├── package.json            # Package configuration
└── tsconfig.json          # TypeScript configuration
```

## Development

To build the package:

```bash
npm run build
```

To run tests:

```bash
npm test
```

## Troubleshooting

1. **Chain Configuration Not Found**
   ```typescript
   const config = getChainConfig(chainId);
   if (!config) {
     throw new Error(`Chain ID ${chainId} not supported`);
   }
   ```

2. **CCTP Gateway Address Handling**
   ```typescript
   const protoCCTPGateway = getChainConfig(chainId)?.protoCCTPGateway;
   if (!protoCCTPGateway) {
     console.warn(`No Proto CCTP Gateway configured for chain ${chainId}`);
   }
   ```

3. **TypeScript Type Checking**
   ```typescript
   // Ensure proper type imports
   import { ChainConfig } from '@vialabs-io/npm-registry';
   
   // Use type guards
   function isValidChainConfig(config: any): config is ChainConfig {
     return (
       typeof config === 'object' &&
       typeof config.name === 'string' &&
       typeof config.network === 'string' &&
       typeof config.chainId === 'number'
     );
   }
   ```

4. **Version Compatibility**
   - Check package.json for peer dependency requirements
   - Ensure TypeScript version matches requirements
   - Update to latest version if experiencing issues:
     ```bash
     npm update @vialabs-io/npm-registry
     ```

5. **Network Connectivity**
   ```typescript
   import axios from 'axios';
   
   async function checkRPCConnection(chainId: number): Promise<boolean> {
     const config = getChainConfig(chainId);
     if (!config?.rpc) {
       throw new Error('No RPC endpoint configured');
     }
     
     try {
       await axios.post(config.rpc, {
         jsonrpc: '2.0',
         method: 'eth_blockNumber',
         params: [],
         id: 1
       });
       return true;
     } catch (error) {
       console.error('RPC connection failed:', error);
       return false;
     }
   }
   ```

6. **Environment-Specific Configuration**
   ```typescript
   // Use environment variables for network selection
   const chainId = process.env.NODE_ENV === 'production' 
     ? 1  // Ethereum Mainnet
     : 11155111; // Sepolia Testnet
   
   const config = getChainConfig(chainId);
   ```
