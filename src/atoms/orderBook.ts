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
