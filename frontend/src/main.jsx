import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { LangProvider } from './context/LangContext'
import './index.css'
import App from './App.jsx'

fetch(import.meta.env.VITE_API_URL?.replace('/api', '') || '')
  .catch(() => {})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LangProvider>
          <App />
        </LangProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)