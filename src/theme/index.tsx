import { transparentize } from 'polished'
import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'

export * from './components'

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 600,
  upToMedium: 960,
  upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text - 保持柔和的文本色调
    text1: darkMode ? '#FFFFFF' : '#2E3338',
    text2: darkMode ? '#E8E9EA' : '#4F5558',
    text3: darkMode ? '#B0B4B7' : '#7A7D80',
    text4: darkMode ? '#878A8C' : '#A5A8AA',
    text5: darkMode ? '#4A4D50' : '#F5F6F7',

    // backgrounds - 使用带绿色调的中性色
    bg1: darkMode ? '#1A1D1B' : '#FFFFFF', // 深色加入绿色微调
    bg2: darkMode ? '#222826' : '#F7FAF8', // 次要背景带绿
    bg3: darkMode ? '#2A332E' : '#EEF3F0', // 卡片背景
    bg4: darkMode ? '#363F3A' : '#E5EAE7',
    bg5: darkMode ? '#4A524D' : '#D1D8D4',

    // specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.25)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',

    // primary colors - 使用北欧风格的绿色系列
    primary1: darkMode ? '#8FBCAB' : '#5E8B7E', // 主绿色
    primary2: darkMode ? '#88C0B0' : '#81A199',
    primary3: darkMode ? '#A3BE8C' : '#88C0A0', // Nord 原生绿色
    primary4: darkMode ? '#8FBCAB80' : '#5E8B7E80',
    primary5: darkMode ? '#5E8B7E60' : '#81A19960',

    // color text
    primaryText1: darkMode ? '#88C0B0' : '#5E8B7E',

    // secondary colors - 采用温暖的次要色
    secondary1: darkMode ? '#D08770' : '#EBCB8B', // 暖橙色/暖黄色
    secondary2: darkMode ? '#D0877080' : '#EBCB8B80',
    secondary3: darkMode ? '#D0877060' : '#EBCB8B60',

    // other - 功能性颜色
    red1: '#BF616A', // 北欧红
    red2: '#D08770', // 珊瑚红
    green1: '#A3BE8C', // 北欧绿
    yellow1: '#EBCB8B', // 北欧黄
    yellow2: '#D08770' // 暖橙色
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.018em;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Inter var', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: 100vh;
  background-position: 0 -30vh;
  background-repeat: no-repeat;
  background-image: ${({ theme }) =>
    `radial-gradient(50% 50% at 50% 50%, ${transparentize(0.9, theme.primary1)} 0%, ${transparentize(
      1,
      theme.bg1
    )} 100%)`};
}
`
