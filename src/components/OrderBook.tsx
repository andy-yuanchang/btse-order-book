import { buyQuotesAtom, lastPriceAtom, sellQuotesAtom } from '@/atoms/orderBook';
import QuoteList from '@/components/QuoteList';
import { useLastPrice } from '@/hooks/useLastPrice';
import { useOrderBook } from '@/hooks/useOrderBook';
import { useAtomValue } from 'jotai';
import React, { useEffect } from 'react';

const OrderBook: React.FC = () => {
  const { connect: connectLastPrice, disconnect: disconnectLastPrice } = useLastPrice({ symbol: 'BTCPFC' })
  const { connect: connectOrderBook, disconnect: disconnectOrderBook } = useOrderBook({ operation: 'subscribe', action: 'update', symbol: 'BTCPFC' })
  const buyQuotes = useAtomValue(buyQuotesAtom)
  const sellQuotes = useAtomValue(sellQuotesAtom)
  const lastPrice = useAtomValue(lastPriceAtom)

  useEffect(() => {
    connectLastPrice()
    connectOrderBook()
    return () => {
      disconnectLastPrice()
      disconnectOrderBook()
    }
  }, [connectLastPrice, disconnectOrderBook, connectOrderBook, disconnectLastPrice])

  return (
    <div className="bg-background text-default p-4">
      <h1 className="text-xl">Order Book</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <QuoteList quotes={buyQuotes} lastPrice={lastPrice} isBuy={true} />
        <QuoteList quotes={sellQuotes} lastPrice={lastPrice} isBuy={false} />
      </div>
    </div>
  );
};

export default OrderBook;
