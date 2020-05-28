import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import axios from 'axios';

axios.defaults.baseURL = 'https://still-cove-37639.herokuapp.com/api/v1';
axios.defaults.withCredentials = true;
axios.defaults.params = {
  mediaURL: 'http://127.0.0.1:8000',
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
