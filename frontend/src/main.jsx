import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SpiderAnimation from './page/SpiderAnimation.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ position: 'relative' }}>
      <SpiderAnimation />
      <App />
    </div>
  </StrictMode>
)
