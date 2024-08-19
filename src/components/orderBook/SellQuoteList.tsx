import { sellQuotesAtom, sellQuotesStyleAtom } from '@/atoms/orderBook'
import QuoteRow from '@/components/orderBook/QuoteRow'
import { useAtomValue } from 'jotai'
import React from 'react'

const SellQuoteList: React.FC = () => {
  const quotes = useAtomValue(sellQuotesAtom)
  const styles = useAtomValue(sellQuotesStyleAtom)
  const calculatedQuotes = quotes.map((quote, index) => {
    const cumulativeSize = quotes
      .slice(index)
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
        />
      ))}
    </div>
  )
}

export default SellQuoteList
