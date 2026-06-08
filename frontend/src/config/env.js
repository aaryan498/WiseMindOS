const PRODUCTION_BACKEND_URL = 'https://wise-mind-os-backend.vercel.app';

export const getBackendURL = () =>
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.PROD ? PRODUCTION_BACKEND_URL : 'http://localhost:4000');
