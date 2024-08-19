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
  const totalSize = quotes.reduce((acc, quote) => acc + Number(quote.size), 0)
  return (
    <>
      {calculatedQuotes.map((quote, index) => (
        <QuoteRow
          key={index}
          quote={quote}
          cumulativeSize={quote.total}
          total={totalSize}
          quoteStyle={styles[index]}
        />
      ))}
    </>
  )
}

export default SellQuoteList
