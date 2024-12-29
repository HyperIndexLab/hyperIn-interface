import { ChainId, Token } from 'hypherin-sdk'
import { TokenInfo } from '@uniswap/token-lists'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../index'


export interface TokenAddressMap {
  [chainId: number]: {
    [tokenAddress: string]: Token
  }
}
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo
  constructor(tokenInfo: TokenInfo) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}


const EMPTY_LIST: TokenAddressMap = {
  [ChainId.KOVAN]: {},
  [ChainId.RINKEBY]: {},
  [ChainId.ROPSTEN]: {},
  [ChainId.GÖRLI]: {},
  [ChainId.MAINNET]: {},
  [ChainId.HASHKEY_TESTNET]:{},
  [ChainId.HASHKEY_MAINNET]:{},
}

export function useTokenList(url: string | undefined): TokenAddressMap {
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)

  return useMemo(() => {
    if (!url) return EMPTY_LIST
    const current = lists[url]?.current
    
    if (!current) return EMPTY_LIST
    try {
      const tokenMap = current.tokens.reduce<TokenAddressMap>(
        (acc, tokenInfo) => {
          const token = new WrappedTokenInfo(tokenInfo)
          const chainAddresses = { ...(acc[token.chainId] || {}) }
          chainAddresses[token.address] = token
          return {
            ...acc,
            [token.chainId]: chainAddresses
          }
        },
        { ...EMPTY_LIST }
      )
      return tokenMap
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return EMPTY_LIST
    }
  }, [lists, url])
}

export function useSelectedListUrl(): string | undefined {
  return useSelector<AppState, AppState['lists']['selectedListUrl']>(state => state.lists.selectedListUrl)
}

export function useSelectedTokenList(): TokenAddressMap {
  const [tokenMap, setTokenMap] = useState<TokenAddressMap>({})

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('https://explorer.hsk.xyz/api/v2/tokens')
        const data = await response.json()
        const newTokenMap: TokenAddressMap = {}

        data.items.forEach((item: any) => {
          const decimals = parseInt(item.decimals)
          const symbol=item.symbol;
          if (isNaN(decimals)) {
            console.warn(`Invalid decimals for token ${item.symbol}: ${item.decimals}`)
            return // 跳过这个token
          }
          if(symbol==='LP'){
            return;
          }

          try {
            const token = new Token(
              ChainId.HASHKEY_MAINNET,
              item.address,
              decimals,
              item.symbol,
              item.name
            )
            if (!newTokenMap[ChainId.HASHKEY_MAINNET]) newTokenMap[ChainId.HASHKEY_MAINNET] = {}
            newTokenMap[ChainId.HASHKEY_MAINNET][token.address] = token
          } catch (error) {
            console.warn(`Error creating token for ${item.symbol}:`, error)
          }
  
        })

        setTokenMap(newTokenMap)
      } catch (error) {
        console.error('Error fetching tokens:', error)
      }
    }

    fetchTokens()
  }, [])

  return tokenMap
}