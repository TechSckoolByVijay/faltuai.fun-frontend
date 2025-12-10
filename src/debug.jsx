import React from 'react';

function DebugInfo() {
  const config = {
    baseUrl: import.meta.env.BASE_URL,
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    backendUrl: import.meta.env.VITE_BACKEND_URL,
    appName: import.meta.env.VITE_APP_NAME,
    basePath: import.meta.env.VITE_BASE_PATH,
    nodeEnv: import.meta.env.NODE_ENV,
    currentUrl: window.location.href,
    pathname: window.location.pathname
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'monospace',
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      margin: '20px',
      borderRadius: '5px'
    }}>
      <h2>🐛 Debug Information</h2>
      <h3>Environment Variables:</h3>
      <pre style={{ backgroundColor: 'white', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(config, null, 2)}
      </pre>
      
      <h3>Current Assets Loading From:</h3>
      <p>CSS and JS files should load from: <strong>{config.baseUrl}assets/</strong></p>
      
      <h3>Expected vs Actual:</h3>
      <ul>
        <li>Expected Base URL: <code>/faltuai.fun-frontend/</code></li>
        <li>Actual Base URL: <code>{config.baseUrl}</code></li>
        <li>Match: {config.baseUrl === '/faltuai.fun-frontend/' ? '✅' : '❌'}</li>
      </ul>
      
      <h3>Build Information:</h3>
      <ul>
        <li>Build Mode: {config.mode}</li>
        <li>Production: {config.prod ? 'Yes' : 'No'}</li>
        <li>Development: {config.dev ? 'Yes' : 'No'}</li>
      </ul>
    </div>
  );
}

export default DebugInfo;