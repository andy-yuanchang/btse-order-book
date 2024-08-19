import { type Quote, type QuotesStyle } from '@/atoms/orderBook'
import cx from 'classnames'
import React from 'react'

interface QuoteRowProps {
  quote: Quote
  total: number
  cumulativeSize: number
  quoteStyle: QuotesStyle
  isBuy?: boolean
}

const QuoteRow: React.FC<QuoteRowProps> = ({
  quote,
  quoteStyle,
  cumulativeSize,
  total,
  isBuy
}) => {
  const ratio = cumulativeSize / total
  const width = `${ratio * 100}%`
  return (
    <div
      className={cx(
        'grid grid-cols-3 hover:bg-quote-hover text-right font-bold',
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
      <div
        className={cx('', {
          'animate-buy-highlight': quoteStyle.sizeChange === 'increase',
          'animate-sell-highlight': quoteStyle.sizeChange === 'decrease'
        })}
      >
        {Number.isNaN(Number(quote.size))
          ? '-'
          : Number(quote.size).toLocaleString()}
      </div>
      <div className="relative">
        <div
          className={cx(`absolute top-0 right-0 bottom-0`, {
            'bg-buy-quote-size': isBuy,
            'bg-sell-quote-size': !isBuy
          })}
          style={{ width }}
        />
        {Number.isNaN(total) ? '-' : total.toLocaleString()}
      </div>
    </div>
  )
}

export default QuoteRow
