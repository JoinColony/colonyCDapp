import { combineReducers } from 'redux-immutable';

import { RootStateRecord } from './state';
import { coreReducer } from './reducers';
import { CORE_NAMESPACE } from './constants';

const createRootReducer = () =>
  combineReducers(
    {
      [CORE_NAMESPACE]: coreReducer,
    },
    () => new RootStateRecord(),
  );

export default createRootReducer;
