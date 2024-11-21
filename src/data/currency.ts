import { Currency } from 'hypherin-sdk'

class HSKCurrency extends Currency {
  public static readonly HSK: Currency = new HSKCurrency(18, 'HSK', 'HSK')
  protected constructor(decimals: number, symbol?: string, name?: string) {
    super(decimals, symbol, name)
  }
}

export const HSK = HSKCurrency.HSK
