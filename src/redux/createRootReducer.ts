import { combineReducers } from 'redux-immutable';

import { RootStateRecord } from './state';
import { coreReducer, usersReducer } from './reducers';
import { CORE_NAMESPACE, USERS_NAMESPACE } from './constants';

const createRootReducer = () =>
  combineReducers(
    {
      [CORE_NAMESPACE]: coreReducer,
      [USERS_NAMESPACE]: usersReducer,
    },
    () => new RootStateRecord(),
  );

export default createRootReducer;
