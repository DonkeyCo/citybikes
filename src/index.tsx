import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import RestAPI from './api/rest';

const api = new RestAPI();
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App api={api}/>
  </React.StrictMode>
);
