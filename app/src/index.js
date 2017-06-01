import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers';
import MatchaRouter from './MatchaRouter.js';
import api from './middleware/api';


const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    api, // make api call when there is [CALL_API] prop in actions
    loggerMiddleware, // neat middleware that logs actions
  ),
);

render(
  <Provider store={store}>
    <MatchaRouter />
  </Provider>,
  document.getElementById('root'),
);
