import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { LocationProvider } from './context/LocationContext'
import { CartProvider } from './context/CartContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  </StrictMode>,
)
