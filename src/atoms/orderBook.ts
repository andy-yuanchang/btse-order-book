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
  sizeChange: 'increase' | 'decrease' | 'not-changed'
}

let previousBuyQuotes: Quote[] | null
export const buyQuotesStyleAtom = atom<QuotesStyle[]>((get) => {
  const quotes = get(buyQuotesAtom)
  const styles: QuotesStyle[] = quotes.map((quote) => {
    if (previousBuyQuotes) {
      const index = previousBuyQuotes.findIndex((x) => x.price === quote.price)
      const isNew = index < 0
      let sizeChange: QuotesStyle['sizeChange'] = 'not-changed'
      if (!isNew && quote.size > previousBuyQuotes[index].size) {
        sizeChange = 'increase'
      } else if (!isNew && quote.size < previousBuyQuotes[index].size) {
        sizeChange = 'decrease'
      }

      return {
        isNew,
        sizeChange
      }
    }
    return {
      isNew: true,
      sizeChange: 'not-changed'
    }
  })

  previousBuyQuotes = quotes.map((quote) => ({ ...quote }))

  return styles
})

let previousSellQuotes: Quote[] | null
export const sellQuotesStyleAtom = atom<QuotesStyle[]>((get) => {
  const quotes = get(sellQuotesAtom)
  const styles: QuotesStyle[] = quotes.map((quote) => {
    if (previousSellQuotes) {
      const index = previousSellQuotes.findIndex((x) => x.price === quote.price)
      const isNew = index < 0
      let sizeChange: QuotesStyle['sizeChange'] = 'not-changed'
      if (
        !isNew &&
        previousSellQuotes &&
        quote.size > previousSellQuotes[index].size
      ) {
        sizeChange = 'increase'
      } else if (
        !isNew &&
        previousSellQuotes &&
        quote.size < previousSellQuotes[index].size
      ) {
        sizeChange = 'decrease'
      }

      return {
        isNew,
        sizeChange
      }
    }
    return {
      isNew: true,
      sizeChange: 'not-changed'
    }
  })

  previousSellQuotes = quotes.map((quote) => ({ ...quote }))

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
