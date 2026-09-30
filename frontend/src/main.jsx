import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { AppProvider } from './store/AppContext.jsx'
import { FocusProvider } from './store/FocusContext.jsx'
import { ThemeProvider } from './store/ThemeContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <BrowserRouter>
          <AppProvider>
            <FocusProvider>
              <App />
            </FocusProvider>
          </AppProvider>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
)
