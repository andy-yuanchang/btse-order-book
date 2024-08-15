import type { Quote } from '@/atoms/orderBook';
import React, { useEffect, useState } from 'react';

interface QuoteRowProps {
  quote: Quote;
  isBuy: boolean;
  lastPrice: number;
}

const QuoteRow: React.FC<QuoteRowProps> = ({ quote, isBuy, lastPrice }) => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setFlash(true);
    const timeout = setTimeout(() => setFlash(false), 1000);
    return () => clearTimeout(timeout);
  }, [quote.size]);

  const getRowStyle = () => {
    if (+quote.price === lastPrice) {
      return 'bg-[#1E3059]';
    }
    return flash ? (isBuy ? 'bg-[rgba(16,186,104,0.12)]' : 'bg-[rgba(255,90,90,0.12)]') : '';
  };

  return (
    <div className={`flex justify-between p-2 ${getRowStyle()} hover:bg-[#1E3059]`}>
      <div className={`${isBuy ? 'text-[#00b15d]' : 'text-[#FF5B5A]'} flex-1 text-center`}>
        {quote.price.toLocaleString()}
      </div>
      <div className="flex-1 text-center">{quote.size.toLocaleString()}</div>
    </div>
  );
};

export default QuoteRow;
