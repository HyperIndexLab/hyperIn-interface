export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  ARBITRUM_KOVAN = 144545313136048,
  ARBITRUM_ONE = 42161,
  HASHKEY_TESTNET=133,
}

export const NETWORK_LABELS: { [chainId in SupportedChainId | number]: string } = {
  [SupportedChainId.MAINNET]: 'Mainnet',
  [SupportedChainId.RINKEBY]: 'Rinkeby',
  [SupportedChainId.ROPSTEN]: 'Ropsten',
  [SupportedChainId.GOERLI]: 'Görli',
  [SupportedChainId.KOVAN]: 'Kovan',
  [SupportedChainId.ARBITRUM_KOVAN]: 'kArbitrum',
  [SupportedChainId.ARBITRUM_ONE]: 'Arbitrum One',
  [SupportedChainId.HASHKEY_TESTNET]:'Hashkey Chain TestNet'
}
