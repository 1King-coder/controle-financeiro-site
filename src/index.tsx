import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Router } from 'react-router-dom';
import history from './services/history';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router history={history}>
      <App />
  </Router>
);

