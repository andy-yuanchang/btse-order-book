import BuyQuoteList from '@/components/orderBook/BuyQuoteList'
import LastPrice from '@/components/orderBook/LastPrice'
import SellQuoteList from '@/components/orderBook/SellQuoteList'
import { useLastPrice } from '@/hooks/useLastPrice'
import { useOrderBook } from '@/hooks/useOrderBook'
import React, { useEffect } from 'react'

const OrderBook: React.FC = () => {
  const { connect: connectLastPrice, disconnect: disconnectLastPrice } =
    useLastPrice({ symbol: 'BTCPFC' })
  const { connect: connectOrderBook, disconnect: disconnectOrderBook } =
    useOrderBook({ operation: 'subscribe', action: 'update', symbol: 'BTCPFC' })

  useEffect(() => {
    connectLastPrice()
    connectOrderBook()
    return () => {
      disconnectLastPrice()
      disconnectOrderBook()
    }
  }, [
    connectLastPrice,
    disconnectOrderBook,
    connectOrderBook,
    disconnectLastPrice
  ])

  return (
    <div className="bg-background text-default p-4">
      <h1 className="text-xl">Order Book</h1>
      <div className="grid grid-cols-1 gap-4 mt-4">
        <SellQuoteList />
        <LastPrice />
        <BuyQuoteList />
      </div>
    </div>
  )
}

export default OrderBook
