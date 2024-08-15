import ErrorBoundary from '@/components/ErrorBoundary'
import OrderBook from './components/OrderBook'

export default function App() {
  return (
    <ErrorBoundary>
      <OrderBook />
    </ErrorBoundary>
  )
}
