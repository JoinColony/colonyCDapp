import { combineReducers } from 'redux-immutable';

import { RootStateRecord } from './state';
import { coreReducer } from './reducers';

const createRootReducer = () =>
  combineReducers(coreReducer, () => new RootStateRecord());

export default createRootReducer;
