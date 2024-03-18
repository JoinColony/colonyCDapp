import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reduxPromiseListener from './createPromiseListener.ts';
import createRootReducer from './createRootReducer.ts';
import setupSagas from './sagas/index.ts';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancer = import.meta.env.DEV
  ? // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  : compose;

const store = createStore(
  createRootReducer(),
  composeEnhancer(
    applyMiddleware(sagaMiddleware, reduxPromiseListener.middleware),
  ),
);

sagaMiddleware.run(setupSagas);

export default store;
