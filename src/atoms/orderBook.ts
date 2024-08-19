import { MAX_QUOTES_LENGTH } from '@/constants'
import { atom } from 'jotai'

export interface Quote {
  price: string
  size: string
}

export type QuotesUpdate = [string, string]

export interface OrderBookData {
  bids: QuotesUpdate[]
  asks: QuotesUpdate[]
  seqNum: number
  prevSeqNum: number
  type: 'snapshot' | 'delta'
  timestamp: number
  symbol: string
}

export const buyQuotesAtom = atom<Quote[]>(
  Array.from({ length: MAX_QUOTES_LENGTH }, () => ({ price: '-', size: '-' }))
)

export const sellQuotesAtom = atom<Quote[]>(
  Array.from({ length: MAX_QUOTES_LENGTH }, () => ({ price: '-', size: '-' }))
)

export interface QuotesStyle {
  isNew: boolean
  sizeChange: 'increase' | 'decrease'
}

let previousBuyQuotes: Quote[] | null
export const buyQuotesStyleAtom = atom<QuotesStyle[]>((get) => {
  const quotes = get(buyQuotesAtom)
  const styles: QuotesStyle[] = quotes.map((quote, index) => {
    const prevQuote = previousBuyQuotes?.[index]
    const isNew = !prevQuote || prevQuote.price !== quote.price
    const sizeChange =
      prevQuote && Number(prevQuote.size) < Number(quote.size)
        ? 'increase'
        : 'decrease'

    return {
      isNew,
      sizeChange
    }
  })

  previousBuyQuotes = quotes

  return styles
})

let previousSellQuotes: Quote[] | null
export const sellQuotesStyleAtom = atom<QuotesStyle[]>((get) => {
  const quotes = get(sellQuotesAtom)
  const styles: QuotesStyle[] = quotes.map((quote, index) => {
    const prevQuote = previousSellQuotes?.[index]
    const isNew = !prevQuote || prevQuote.price !== quote.price
    const sizeChange =
      prevQuote && Number(prevQuote.size) < Number(quote.size)
        ? 'increase'
        : 'decrease'

    return {
      isNew,
      sizeChange
    }
  })

  previousSellQuotes = quotes

  return styles
})

export interface LastPriceData {
  price: number
  side: 'SELL' | 'BUY'
  size: number
  symbol: string
  timestamp: number
  tradeId: number
}

export const lastPriceAtom = atom(0)
export const priceStateAtom = atom<'higher' | 'lower' | 'equivalent'>(
  'equivalent'
)
