import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AudioProvider } from './context/AudioContext';
import { CartProvider } from './context/CartContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AudioProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AudioProvider>
  </React.StrictMode>
);
