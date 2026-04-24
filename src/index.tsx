import React from 'react';
import ReactDOM from 'react-dom';
import 'src/assets/scss/index.scss';
import '../src/assets/scss/index.scss';
import 'antd/dist/antd.css';
import 'src/assets/scss/custom.scss';
import '../src/assets/scss/custom.scss';
import { App } from './App/App';
import { Provider } from 'react-redux';
import { store } from './redux';
import "flatpickr/dist/flatpickr.min.css";
import 'src/redux/interceptor';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App></App>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
