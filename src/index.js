import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './asset/style/reset.css';
import 'antd/dist/antd.less';
import zhCN from 'antd/es/locale/zh_CN';
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import {ConfigProvider} from 'antd'
import moment from 'moment';
import 'moment/locale/zh-cn';
import history from './utils/history';
import store from './store'
import './style.less'

moment.locale('zh-cn');

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ConfigProvider locale={zhCN}>
        <App/>
      </ConfigProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
