import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import callAPI from './middlewares/callAPI';
import ReduxPromise from 'redux-promise';
import reducers from './reducers';
import routes from './routes/index';

const createStoreWithMiddleware = applyMiddleware(callAPI,ReduxPromise)(createStore);

ReactDOM.render(
 <Provider store={createStoreWithMiddleware(reducers)}>
  	<Router history={browserHistory} routes={routes}>
    </Router>
  </Provider>,
  document.getElementById('uport')
);
