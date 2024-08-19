import { lastPriceAtom, type Quote } from '@/atoms/orderBook'
import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'

interface QuoteRowProps {
  quote: Quote
  isBuy: boolean
  total: number
}

const QuoteRow: React.FC<QuoteRowProps> = ({ quote, isBuy, total }) => {
  const lastPrice = useAtomValue(lastPriceAtom)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    setFlash(true)
    const timeout = setTimeout(() => setFlash(false), 1000)
    return () => clearTimeout(timeout)
  }, [quote.size])

  const getRowStyle = () => {
    if (+quote.price === lastPrice) {
      return 'bg-[#1E3059]'
    }
    return flash
      ? isBuy
        ? 'bg-[rgba(16,186,104,0.12)]'
        : 'bg-[rgba(255,90,90,0.12)]'
      : ''
  }

  return (
    <div
      className={`grid grid-cols-3 p-2 ${getRowStyle()} hover:bg-[#1E3059] text-right font-bold`}
    >
      <div className={`${isBuy ? 'text-[#00b15d]' : 'text-[#FF5B5A]'}`}>
        {Number.isNaN(Number(quote.price))
          ? '-'
          : Number(quote.price).toLocaleString()}
      </div>
      <div>
        {Number.isNaN(Number(quote.size))
          ? '-'
          : Number(quote.size).toLocaleString()}
      </div>
      <div>{Number.isNaN(total) ? '-' : total.toLocaleString()}</div>
    </div>
  )
}

export default QuoteRow
