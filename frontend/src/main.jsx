import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AppProvider } from './store/AppContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { toast } from 'react-toastify';

// Global handler for uncaught exceptions
window.onerror = function (message, source, lineno, colno, error) {
  console.error('Global unhandled error:', message, error);
  toast.error('An unexpected error occurred. Please try again.');
  return false;
};

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', function (event) {
  console.error('Unhandled promise rejection:', event.reason);
  toast.error('An unexpected error occurred. Please try again.');
});

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
)
