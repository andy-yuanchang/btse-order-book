import React, { useEffect, useRef, useState } from 'react';

interface Quote {
  price: number;
  size: number;
}

interface OrderBookState {
  buyQuotes: Quote[];
  sellQuotes: Quote[];
  lastPrice: number;
}

const OrderBook: React.FC = () => {
  const [orderBook, setOrderBook] = useState<OrderBookState>({
    buyQuotes: [],
    sellQuotes: [],
    lastPrice: 0,
  });

  const wsOrderBook = useRef<WebSocket | null>(null);
  const wsLastPrice = useRef<WebSocket | null>(null);
  const [seqNum, setSeqNum] = useState<number | null>(null);

  useEffect(() => {
    wsOrderBook.current = new WebSocket('wss://ws.btse.com/ws/oss/futures');
    wsLastPrice.current = new WebSocket('wss://ws.btse.com/ws/futures');

    // Subscribe to the order book
    wsOrderBook.current.onopen = () => {
      wsOrderBook.current?.send(
        JSON.stringify({
          op: 'subscribe',
          args: ['update:BTCPFC'],
        })
      );
    };

    // Subscribe to last price
    wsLastPrice.current.onopen = () => {
      wsLastPrice.current?.send(
        JSON.stringify({
          op: 'subscribe',
          args: ['tradeHistoryApi:BTCPFC'],
        })
      );
    };

    wsOrderBook.current.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.type === 'snapshot') {
        setSeqNum(data.seqNum);
        processSnapshot(data);
      } else if (data.type === 'delta') {
        if (data.prevSeqNum !== seqNum) {
          // Re-subscribe if seqNum mismatch
          wsOrderBook.current?.send(
            JSON.stringify({
              op: 'subscribe',
              args: ['update:BTCPFC'],
            })
          );
        } else {
          setSeqNum(data.seqNum);
          processDelta(data);
        }
      }
    };

    wsLastPrice.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const lastPrice = data[0]?.price || 0;
      setOrderBook((prev) => ({
        ...prev,
        lastPrice,
      }));
    };

    return () => {
      wsOrderBook.current?.close();
      wsLastPrice.current?.close();
    };
  }, [seqNum]);

  const processSnapshot = (data: any) => {
    setOrderBook({
      buyQuotes: data.buys.slice(0, 8).map((q: any) => ({ price: q.price, size: q.size })),
      sellQuotes: data.sells.slice(0, 8).map((q: any) => ({ price: q.price, size: q.size })),
      lastPrice: orderBook.lastPrice,
    });
  };

  const processDelta = (data: any) => {
    const updatedBuyQuotes = [...orderBook.buyQuotes];
    const updatedSellQuotes = [...orderBook.sellQuotes];

    // Handle buy updates
    data.buys.forEach((buyUpdate: any) => {
      const index = updatedBuyQuotes.findIndex((q) => q.price === buyUpdate.price);
      if (index >= 0) {
        if (buyUpdate.size === 0) {
          updatedBuyQuotes.splice(index, 1);
        } else {
          updatedBuyQuotes[index].size = buyUpdate.size;
        }
      } else {
        updatedBuyQuotes.push({ price: buyUpdate.price, size: buyUpdate.size });
        updatedBuyQuotes.sort((a, b) => b.price - a.price);
      }
    });

    // Handle sell updates
    data.sells.forEach((sellUpdate: any) => {
      const index = updatedSellQuotes.findIndex((q) => q.price === sellUpdate.price);
      if (index >= 0) {
        if (sellUpdate.size === 0) {
          updatedSellQuotes.splice(index, 1);
        } else {
          updatedSellQuotes[index].size = sellUpdate.size;
        }
      } else {
        updatedSellQuotes.push({ price: sellUpdate.price, size: sellUpdate.size });
        updatedSellQuotes.sort((a, b) => a.price - b.price);
      }
    });

    setOrderBook({
      buyQuotes: updatedBuyQuotes.slice(0, 8),
      sellQuotes: updatedSellQuotes.slice(0, 8),
      lastPrice: orderBook.lastPrice,
    });
  };

  return (
    <div className="bg-[#131B29] text-[#F0F4F8] p-4">
      <h1 className="text-xl">Order Book</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <QuoteList quotes={orderBook.buyQuotes} isBuy={true} lastPrice={orderBook.lastPrice} />
        <QuoteList quotes={orderBook.sellQuotes} isBuy={false} lastPrice={orderBook.lastPrice} />
      </div>
    </div>
  );
};

export default OrderBook;
