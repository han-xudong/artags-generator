/**
 * Application Entry Point
 * This file serves as the main entry point for the React application.
 * It renders the root App component into the DOM and initializes i18n for internationalization.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Initialize internationalization
import './i18n';

// Create React root and render the App component with StrictMode enabled
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
