import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './config/i18n';
import './index.less';
import './index.scss';
import { AccountProvider } from './hooks/account';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Suspense fallback='loading'>
    <Router>
      <AccountProvider>
        <App />
      </AccountProvider>
    </Router>
  </Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
