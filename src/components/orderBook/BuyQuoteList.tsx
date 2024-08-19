import { buyQuotesAtom, buyQuotesStyleAtom } from '@/atoms/orderBook'
import QuoteRow from '@/components/orderBook/QuoteRow'
import { useAtomValue } from 'jotai'
import React from 'react'

const BuyQuoteList: React.FC = () => {
  const quotes = useAtomValue(buyQuotesAtom)
  const styles = useAtomValue(buyQuotesStyleAtom)
  const calculatedQuotes = quotes.map((quote, index) => {
    const cumulativeSize = quotes
      .slice(0, index + 1)
      .reduce((acc, q) => acc + Number(q.size), 0)
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
        <QuoteRow
          key={index}
          quote={quote}
          total={quote.total}
          quoteStyle={styles[index]}
          isBuy
        />
      ))}
    </div>
  )
}

export default BuyQuoteList
