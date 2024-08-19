# BTSE Order Book

An order book simulation using React + Vite.

<video width="320" height="240" Controls>
  <source src="/docs/demo.mov" type="video/mp4">
</video>

Demo Link: https://btse-order-book.vercel.app/

## Hooks

- [useWebSocket](/src/hooks/useWebSocket.ts): Implement multiple methods based on `WebSocket`, including `reconnect` and `ping-pong`.
- [useOrderBook](/src/hooks/useOrderBook.ts): Processing `snapshot` and `delta` data by using `useWebSocket`.
- [useLastPrice](/src/hooks/useLastPrice.ts): Get last price by using `useWebSocket`.
- [usePersistentCallback](/src/hooks/usePersistentCallback.ts): Get latest function without changing reference.

## How

- Framework: React, Vue.js
- Show max 8 quotes for both buy and sell. Quote row should vertical align center.
  - Use `.slice(0, 8)`. [🔗](/src/hooks/useOrderBook.ts#L81)
- Format number with commas as thousands separators.
  - Use `toLocaleString` to implement it. [🔗](/src/components/orderBook/QuoteRow.tsx#L35)
- Add hover background color on whole row when mouse hover on the quote.
  - Add colors to `tailwind.config.js`. [🔗](/src/components/orderBook/QuoteRow.tsx#L25)
- Last price color style:
  - Update price state when receiving the data from websocket. [🔗](/src/hooks/useLastPrice.ts#L32)
- Quote total formula:
  - Sell quotes: sum up quote size from lowest price quote to the highest [🔗](/src/components/orderBook/SellQuoteList.tsx#L9)
  - Buy quotes: sum up quote size from highest price quote to the lowest [🔗](/src/components/orderBook/BuyQuoteList.tsx#L9)
- Accumulative total size percentage bar formula:
  - Current quote accumulative total size / Total quote size of buy or sell [🔗](/src/components/orderBook/QuoteRow.tsx#L21)
- Quote highlight animation:
  - When new quote appear(price hasn't shown on the order book before), add highlight animation on whole quote row. Red background color for sell quote. Green background color for buy quote. [🔗](/src/atoms/orderBook.ts#L87)
  - When quote size change, add highlight animation on size cell. Green background color if size increase. Red background color if size decrease. [🔗](/src/atoms/orderBook.ts#L88)

Third-party dependencies:

- [Tailwindcss](https://tailwindcss.com/docs/installation): easily style solution
- [Jotai](https://jotai.org/docs/introduction): micro state management across components
- [Classnames](https://github.com/JedWatson/classnames#readme): more readable classnames along with tailwindcss
