import React from 'react';
import Routes from './routes';
import { Router } from 'react-router-dom';
import history from './services/history';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';

function App(): JSX.Element {
  return (
    <Router history={history}>
      <Header />
      <GlobalStyles />
      <ToastContainer autoClose={3000} className={'toast-container'}/>
      <Routes />
    </Router>
  );
    
}

export default App;
