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
          isBuy
        />
      ))}
    </>
  )
}

export default BuyQuoteList
