import ErrorBoundary from '@/components/ErrorBoundary'
import OrderBook from '@/components/orderBook/OrderBook'

export default function App() {
  return (
    <ErrorBoundary>
      <OrderBook />
    </ErrorBoundary>
  )
}
