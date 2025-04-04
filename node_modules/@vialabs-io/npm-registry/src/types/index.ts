export interface ChainConfig {
  name: string;
  network: 'mainnet' | 'testnet' | 'stagenet';
  type: 'evm' | 'solana' | 'reef';
  chainId: number;
  message: string;
  messageSubstrate?: string;
  feeToken: string;
  weth: string;
  usdc?: string;
  eurc?: string;
  rpc?: string;
  explorer?: string;
  circleTokenMessenger?: string;
  circleMessageTransmitter?: string;
  circleTokenMinter?: string;
  featureGateway?: string;
  protoCCTPGateway?: string;
  intentCCTPGateway?: string;
  featureCCTP?: string;
  // CCTP-specific fields
  isCCTPEnabled?: boolean;
  cctpLeafChains?: Array<{
    chainId: number;
    rootManager: string;
    leafManager: string;
  }>;
}

export interface ChainConfigs {
  [chainId: number]: ChainConfig;
}
