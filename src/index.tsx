import '@/styles/global.css'
import { createRoot } from 'react-dom/client'
import App from './App'

const element = document.getElementById('root')
if (element === null) throw new Error('Root container missing in index.html')

const root = createRoot(element)
root.render(
  <App />
)
