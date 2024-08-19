import { type Quote, type QuotesStyle } from '@/atoms/orderBook'
import cx from 'classnames'
import React from 'react'

interface QuoteRowProps {
  quote: Quote
  total: number
  quoteStyle: QuotesStyle
  isBuy?: boolean
}

const QuoteRow: React.FC<QuoteRowProps> = ({
  quote,
  quoteStyle,
  total,
  isBuy
}) => {
  return (
    <div
      className={cx(
        'grid grid-cols-3 p-2 hover:bg-quote-hover text-right font-bold',
        {
          'animate-buy-highlight': isBuy && quoteStyle.isNew,
          'animate-sell-highlight': !isBuy && quoteStyle.isNew
        }
      )}
    >
      <div className={`${isBuy ? 'text-buy-quote' : 'text-sell-quote'}`}>
        {Number.isNaN(Number(quote.price))
          ? '-'
          : Number(quote.price).toLocaleString()}
      </div>
      <div>
        {Number.isNaN(Number(quote.size))
          ? '-'
          : Number(quote.size).toLocaleString()}
      </div>
      <div className={``}>
        {Number.isNaN(total) ? '-' : total.toLocaleString()}
      </div>
    </div>
  )
}

export default QuoteRow
