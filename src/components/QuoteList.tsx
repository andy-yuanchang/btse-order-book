import { type Quote } from '@/atoms/orderBook'
import QuoteRow from '@/components/QuoteRow'
import React from 'react'

interface QuoteListProps {
  quotes: Quote[]
  isBuy: boolean
}

const QuoteList: React.FC<QuoteListProps> = ({ quotes, isBuy }) => {
  const calculatedQuotes = quotes.map((quote, index) => {
    const cumulativeSize = isBuy
      ? quotes.slice(0, index + 1).reduce((acc, q) => acc + Number(q.size), 0)
      : quotes.slice(index).reduce((acc, q) => acc + Number(q.size), 0)

    return { ...quote, total: cumulativeSize }
  })
  return (
    <div>
      <div className="grid grid-cols-3 text-right">
        <div className="text-quote-head text-sm">Price(USD)</div>
        <div className="text-quote-head text-sm">Size</div>
        <div className="text-quote-head text-sm">Total</div>
      </div>
      {calculatedQuotes.map((quote, index) => (
        <QuoteRow key={index} quote={quote} isBuy={isBuy} total={quote.total} />
      ))}
    </div>
  )
}

export default QuoteList
