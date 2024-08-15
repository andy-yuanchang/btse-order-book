import { lastPriceAtom } from "@/atoms/orderBook";
import { LAST_PRICE_WS_URL } from "@/constants";
import { useSetAtom } from "jotai";
import usePersistentCallback from "./usePersistentCallback";
import { useWebSocket } from "./useWebSocket";

interface UseLastPriceParams {
  symbol: string
}

interface UseLastPriceReturn {
  connect: () => void
  disconnect: () => void
}

export const useLastPrice = ({ symbol }: UseLastPriceParams): UseLastPriceReturn => {
  const setLastPrice = useSetAtom(lastPriceAtom)

  const handleLastPriceMessage = (data: any) => {
    const lastPrice = data[0]?.price || 0;
    setLastPrice(lastPrice);
  };

  const handleLastPriceOpen = usePersistentCallback(() => {
    sendLastPriceMessage(JSON.stringify({
      op: 'subscribe',
      args: [`tradeHistoryApi:${symbol}`]
    }))
  })

  const { connect, disconnect, sendMessage: sendLastPriceMessage } = useWebSocket({
    url: LAST_PRICE_WS_URL,
    onMessage: handleLastPriceMessage,
    reconnectEnabled: true,
    onOpen: handleLastPriceOpen
  });

  return {
    connect,
    disconnect,
  }
}