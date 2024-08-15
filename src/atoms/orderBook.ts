import { atom } from 'jotai';

export interface Quote {
  price: string;
  size: string;
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

export const buyQuotesAtom = atom<Quote[]>([])

export const sellQuotesAtom = atom<Quote[]>([])

export const lastPriceAtom = atom(0)