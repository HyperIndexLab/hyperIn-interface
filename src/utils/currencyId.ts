import { Currency, ETHER, Token } from 'hypherin-sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'HSK'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
