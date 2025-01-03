// import { ChainId } from 'hypherin-sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'

import styled from 'styled-components'
import { darken } from 'polished'
// import Logo from '../../assets/svg/logo.svg'
// import LogoDark from '../../assets/svg/logo_white.svg'
import Wordmark from '../../assets/images/logo.png'
import WordmarkDark from '../../assets/images/logo-dark.png'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import hskLogo from '../../assets/images/hsk-logo.png'

import { YellowCard } from '../Card'
import Settings from '../Settings'
// import Menu from '../Menu'
import { NavLink } from 'react-router-dom'
import Row, { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import { useTranslation } from 'react-i18next'
// import VersionSwitch from './VersionSwitch'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  pointer-events: auto;
  background-color: none;
  padding: 0;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  border-radius: 50%;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

type SupportedChainId = 1 | 133

const NETWORK_LABELS: { [chainId in SupportedChainId]: string | null } = {1: null,133: 'HashKey Sepolia'}

const NETWORK_CONFIG: { [chainId in SupportedChainId]: { logo: string } } = {
  1: { logo: '' }, // 主网不显示logo
  133: { logo: hskLogo } // HashKey 测试网显示logo

}
const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  margin-left: 20px;
  margin-top: 8px;
  border-radius: 2rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 16px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark] = useDarkModeManager()
  const { t } = useTranslation()
  const handleToNews=()=>{
    window.open('https://news.hyperindex.trade', '_blank')
  }
  
  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'center' }} padding="1rem 1rem 0 1rem">
        <HeaderElement>
          <Title href=".">
            <TitleText>
              <img
                style={{ width: '60px', height: '24px', marginLeft: '4px', marginTop: '4px' }}
                src={isDark ? WordmarkDark : Wordmark}
                alt="logo"
              />
            </TitleText>
          </Title>
          <StyledNavLink id={`pool-nav-link`} to={'/swap'} >
            {t('trade')}
          </StyledNavLink>
          <StyledNavLink id={`pool-nav-link`} to={'/explore'} >
            {t('explore')}
          </StyledNavLink>
          <StyledNavLink onClick={()=>handleToNews()} id={`pool-nav-link`} to={'/news'} >
            {t('news')}
          </StyledNavLink>
          <StyledNavLink id={`pool-nav-link`} to={'/activity'} >
            {t('gift')}
          </StyledNavLink>
        </HeaderElement>
        <HeaderControls>
          <HeaderElement>
            <TestnetWrapper>
              {!isMobile && chainId && (chainId as SupportedChainId) in NETWORK_LABELS && (
                <NetworkCard>
                  {NETWORK_CONFIG[chainId as SupportedChainId].logo && (
                    <img
                      src={NETWORK_CONFIG[chainId as SupportedChainId].logo}
                      alt="Network Logo"
                      style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                    />
                  )}
                </NetworkCard>
              )}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} HSK
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
          <HeaderElementWrap>
            <Settings />
          </HeaderElementWrap>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
