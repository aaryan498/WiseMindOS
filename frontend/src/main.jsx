import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AppProvider } from './store/AppContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId && import.meta.env.DEV) {
  console.warn('VITE_GOOGLE_CLIENT_ID is not set. Google Sign-In will not work.');
}

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
)
