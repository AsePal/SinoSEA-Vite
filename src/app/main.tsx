import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './App';
import '../shared/i18n';
import i18n from '../shared/i18n';

const storedLang = localStorage.getItem('lang');

const resolvedLang = storedLang || (navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US');

i18n.changeLanguage(resolvedLang);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
