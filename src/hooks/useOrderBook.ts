import {
  buyQuotesAtom,
  type OrderBookData,
  QuotesUpdate,
  sellQuotesAtom
} from '@/atoms/orderBook'
import { ConnectionStatus, ORDER_BOOK_WS_URL } from '@/constants'
import usePersistentCallback from '@/hooks/usePersistentCallback'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useSetAtom } from 'jotai'
import { useRef } from 'react'

interface UseOrderBookParams {
  operation: string
  action: string
  symbol: string
  group?: number
}

interface UseOrderBookReturn {
  connect: () => void
  disconnect: () => void
}

export const useOrderBook = ({
  operation,
  action,
  symbol,
  group
}: UseOrderBookParams): UseOrderBookReturn => {
  const setBuyQuotes = useSetAtom(buyQuotesAtom)
  const setSellQuotes = useSetAtom(sellQuotesAtom)
  const seqNum = useRef<number>(0)

  const handleMessage = (message: MessageEvent) => {
    const data = JSON.parse(message.data)
    const dataDetail = data.data as OrderBookData
    if (!dataDetail) {
      return
    }
    if (dataDetail.type === 'snapshot') {
      seqNum.current = dataDetail.seqNum
      processSnapshot(dataDetail)
    } else if (dataDetail.type === 'delta') {
      if (dataDetail.prevSeqNum !== seqNum.current) {
        reconnect() // Re-subscribe if seqNum mismatch
      } else {
        seqNum.current = dataDetail.seqNum
        processDelta(dataDetail)
      }
    }
  }

  const handleOpen = usePersistentCallback(() => {
    if (status === ConnectionStatus.OPEN) {
      sendMessage(
        JSON.stringify({
          op: operation,
          args: [
            `${action}:${symbol}${group && typeof group === 'number' ? '_' + group : ''}`
          ]
        })
      )
    }
  })

  const { connect, disconnect, sendMessage, status } = useWebSocket({
    url: ORDER_BOOK_WS_URL,
    onMessage: handleMessage,
    reconnectEnabled: true,
    onOpen: handleOpen,
    onError(event) {
      console.error('useOrderBook error', event)
    },
    onClose(event) {
      console.error('useOrderBook close', event)
    }
  })

  const processSnapshot = (data: OrderBookData) => {
    setBuyQuotes(
      data.bids.slice(0, 8).map((q) => ({ price: q[0], size: q[1] }))
    )
    setSellQuotes(
      data.asks.slice(0, 8).map((q) => ({ price: q[0], size: q[1] }))
    )
  }

  const processDelta = (data: OrderBookData) => {
    setBuyQuotes((preBuyQuotes) => {
      data.bids.forEach((buyUpdate: QuotesUpdate) => {
        const index = preBuyQuotes.findIndex((q) => q.price === buyUpdate[0])
        if (index >= 0) {
          if (+buyUpdate[1] > 0) {
            preBuyQuotes[index].size = buyUpdate[1]
          } else {
            preBuyQuotes.splice(index, 1)
          }
        } else {
          preBuyQuotes.push({ price: buyUpdate[0], size: buyUpdate[1] })
        }
      })
      return preBuyQuotes
        .filter(({ size }) => +size !== 0)
        .sort((a, b) => Number(b.price) - Number(a.price))
        .slice(0, 8)
    })

    setSellQuotes((preSellQuotes) => {
      data.asks.forEach((sellUpdate: QuotesUpdate) => {
        const index = preSellQuotes.findIndex((q) => q.price === sellUpdate[0])
        if (index >= 0) {
          if (+sellUpdate[1] > 0) {
            preSellQuotes[index].size = sellUpdate[1]
          } else {
            preSellQuotes.splice(index, 1)
          }
        } else {
          preSellQuotes.push({ price: sellUpdate[0], size: sellUpdate[1] })
        }
      })
      console.log(preSellQuotes)
      return preSellQuotes
        .filter(({ size }) => +size !== 0)
        .sort((a, b) => Number(b.price) - Number(a.price))
        .slice(0, 8)
    })
  }

  const reconnect = () => {
    disconnect()
    connect()
  }

  return {
    connect,
    disconnect
  }
}
