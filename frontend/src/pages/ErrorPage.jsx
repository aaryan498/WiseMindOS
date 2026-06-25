import React from 'react';

const ErrorPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem', textAlign: 'center', backgroundColor: '#121212', color: '#ffffff' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Oops! Something went wrong.</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#aaaaaa' }}>We're sorry, but an unexpected error occurred while rendering this page.</p>
      <button 
        onClick={() => window.location.reload()} 
        style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold' }}
      >
        Refresh Page
      </button>
    </div>
  );
};

export default ErrorPage;
