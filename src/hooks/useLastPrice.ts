import {
  lastPriceAtom,
  priceStateAtom,
  type LastPriceData
} from '@/atoms/orderBook'
import { LAST_PRICE_WS_URL } from '@/constants'
import { useAtom, useSetAtom } from 'jotai'
import usePersistentCallback from './usePersistentCallback'
import { useWebSocket } from './useWebSocket'

interface UseLastPriceParams {
  symbol: string
}

interface UseLastPriceReturn {
  connect: () => void
  disconnect: () => void
}

export const useLastPrice = ({
  symbol
}: UseLastPriceParams): UseLastPriceReturn => {
  const [lastPrice, setLastPrice] = useAtom(lastPriceAtom)
  const setPriceState = useSetAtom(priceStateAtom)

  const handleLastPriceMessage = usePersistentCallback(
    (message: MessageEvent) => {
      const data = JSON.parse(message.data)
      const dataDetail = data.data as LastPriceData[]
      if (dataDetail) {
        const price = dataDetail[0]?.price || 0
        setLastPrice(price)
        if (price === lastPrice) {
          setPriceState('equivalent')
        } else if (price > lastPrice) {
          setPriceState('higher')
        } else if (price < lastPrice) {
          setPriceState('lower')
        }
      }
    }
  )

  const handleLastPriceOpen = usePersistentCallback(() => {
    sendLastPriceMessage(
      JSON.stringify({
        op: 'subscribe',
        args: [`tradeHistoryApi:${symbol}`]
      })
    )
  })

  const {
    connect,
    disconnect,
    sendMessage: sendLastPriceMessage
  } = useWebSocket({
    url: LAST_PRICE_WS_URL,
    onMessage: handleLastPriceMessage,
    reconnectEnabled: true,
    onOpen: handleLastPriceOpen,
    onError(error) {
      console.error('useLastPrice error', error)
    },
    onClose(error) {
      console.error('useLastPrice close', error)
    }
  })

  return {
    connect,
    disconnect
  }
}
