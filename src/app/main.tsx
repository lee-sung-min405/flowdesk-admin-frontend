import { setupAuthAxiosInterceptor } from '@features/auth/lib/setup-auth-interceptor';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

setupAuthAxiosInterceptor();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
