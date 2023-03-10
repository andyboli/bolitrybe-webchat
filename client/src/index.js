import React from 'react';

import ReactDOM from 'react-dom';

import socketIOClient from 'socket.io-client';

import App from './App';

import { Provider } from './context';

import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';

const event = socketIOClient('http://localhost:4555');

ReactDOM.render(
  <React.StrictMode>
    <Provider event={event}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
