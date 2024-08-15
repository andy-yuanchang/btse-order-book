import { type Quote } from '@/atoms/orderBook';
import QuoteRow from '@/components/QuoteRow';
import React from 'react';

interface QuoteListProps {
  quotes: Quote[];
  isBuy: boolean;
  lastPrice: number;
}

const QuoteList: React.FC<QuoteListProps> = ({ quotes, isBuy, lastPrice }) => {
  return (
    <div>
      <div className="text-quote-head text-sm">Price</div>
      <div className="text-quote-head text-sm">Size</div>
      {quotes.map((quote, index) => (
        <QuoteRow key={index} quote={quote} isBuy={isBuy} lastPrice={lastPrice} />
      ))}
    </div>
  );
};

export default QuoteList;
