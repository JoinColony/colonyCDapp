import { combineReducers } from 'redux-immutable';

import { coreReducer } from './reducers';
import { RootStateRecord } from './state';

const createRootReducer = () =>
  combineReducers(coreReducer, () => new RootStateRecord());

export default createRootReducer;
