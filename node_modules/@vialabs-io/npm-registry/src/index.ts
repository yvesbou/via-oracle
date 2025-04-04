import { ChainConfig } from './types';
import { supportsCCTP, getCCTPGateways } from './utils';
import { globalConfig, getAccountantAddress as getAccountantAddressFromGlobal } from './global';
import { mainnetConfigs, testnetConfigs } from './chainConfigs';

export function getChainConfig(chainId: number, type: string = ""): ChainConfig | undefined {
    if (type) {
        // @note for chains that re-use the same id
        const chainData = type == "mainnet" ? mainnetConfigs[chainId] : testnetConfigs[chainId];
        return chainData;
    }

    return mainnetConfigs[chainId] || testnetConfigs[chainId];
}

export function isMainnet(chainId: number): boolean {
    return chainId in mainnetConfigs;
}

export function isTestnet(chainId: number): boolean {
    return chainId in testnetConfigs;
}

export function getAllMainnetChainIds(): number[] {
    return Object.keys(mainnetConfigs).map(Number);
}

export function getAllTestnetChainIds(): number[] {
    return Object.keys(testnetConfigs).map(Number);
}

export function getAllChainIds(): number[] {
    return [...getAllMainnetChainIds(), ...getAllTestnetChainIds()];
}

export function getHardhatNetworks(options: { chainIds?: number[], defaultConfig?: any } = {}) {
    const { chainIds = getAllChainIds(), defaultConfig = {} } = options;
    const networks: { [name: string]: any } = {};

    chainIds.forEach(chainId => {
        const config = getChainConfig(chainId);
        
        if (config) {
            if (config.rpc) {
                const networkType = isMainnet(chainId) ? 'mainnet' : 'testnet';
                const networkName = `${config.network}-${networkType}`;
                networks[networkName] = {
                    url: config.rpc,
                    chainId,
                    ...defaultConfig,
                };
            }
        }
    });

    return networks;
}

export function getAccountantAddress(isTestnet: boolean): string {
    return getAccountantAddressFromGlobal(isTestnet);
}

export { ChainConfig, supportsCCTP, getCCTPGateways, globalConfig };
