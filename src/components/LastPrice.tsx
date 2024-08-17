import { lastPriceAtom, priceStateAtom } from '@/atoms/orderBook'
import cx from 'classnames'
import { useAtomValue } from 'jotai'
import ArrowIcon from './ArrowIcon'

const LastPrice: React.FC = () => {
  const lastPrice = useAtomValue(lastPriceAtom)
  const priceState = useAtomValue(priceStateAtom)
  return (
    <div
      className={cx(
        'p-4 w-full mx-auto flex justify-center items-center gap-1',
        {
          'text-buy-quote bg-buy-bar': priceState === 'higher',
          'text-sell-quote bg-sell-bar': priceState === 'lower',
          'text-default bg-quote-head': priceState === 'equivalent'
        }
      )}
    >
      <span className="leading-5 h-5">{lastPrice.toLocaleString()}</span>
      <ArrowIcon
        className={cx('origin-center leading-5 h-5', {
          'rotate-180': priceState === 'higher',
          'rotate-90': priceState === 'equivalent'
        })}
      />
    </div>
  )
}

export default LastPrice
