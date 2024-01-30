import { combineReducers } from 'redux-immutable';

import { coreReducer } from './reducers/index.ts';
import { RootStateRecord } from './state/index.ts';

const createRootReducer = () =>
  combineReducers(coreReducer, () => new RootStateRecord());

export default createRootReducer;
