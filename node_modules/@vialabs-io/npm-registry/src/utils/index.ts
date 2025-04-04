import { ChainConfig } from '../types';
import { mainnetConfigs, testnetConfigs } from '../chainConfigs';

// Combine mainnet and testnet configs
const chainConfigs = { ...mainnetConfigs, ...testnetConfigs };

export function getChainConfig(chainId: number): ChainConfig | undefined {
  return chainConfigs[chainId];
}

export function getAddress(chainId: number, addressType: keyof ChainConfig): string | undefined {
  const config = getChainConfig(chainId);
  if (!config) return undefined;
  return config[addressType] as string | undefined;
}

export function isMainnet(chainId: number): boolean {
  const config = getChainConfig(chainId);
  return config ? config.network === 'mainnet' : false;
}

export function isTestnet(chainId: number): boolean {
  const config = getChainConfig(chainId);
  return config ? config.network === 'testnet' : false;
}

export function getSupportedChains(): number[] {
  return Object.keys(chainConfigs).map(Number);
}

export function getMainnetChains(): number[] {
  return getSupportedChains().filter(isMainnet);
}

export function getTestnetChains(): number[] {
  return getSupportedChains().filter(isTestnet);
}

export function supportsCCTP(chainId: number): boolean {
  const config = getChainConfig(chainId);
  return config ? (!!config.protoCCTPGateway || !!config.intentCCTPGateway) : false;
}

export function getCCTPGateways(chainId: number): { proto?: string, intent?: string } | undefined {
  const config = getChainConfig(chainId);
  if (!config) return undefined;
  return {
    proto: config.protoCCTPGateway,
    intent: config.intentCCTPGateway
  };
}
