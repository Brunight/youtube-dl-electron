import React from 'react';
import { HashRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import { ToastProvider } from './hooks/toast';
import GlobalStyle from './styles/global';

import Routes from './routes';

const App: React.FC = () => {
  return (
    <>
      <ToastProvider>
        <HashRouter>
          <Routes />
        </HashRouter>
      </ToastProvider>
      <GlobalStyle />
    </>
  );
};

export default hot(module)(App);
