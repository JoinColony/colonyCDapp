import { call } from 'redux-saga/effects';

import {
  getContext,
  setContext,
  ContextModule,
  ColonyManager,
} from '~context/index.ts';

import getNetworkClient from './getNetworkClient.ts';
import { create } from './index.ts';

/*
 * Return an initialized ColonyManager instance.
 */
export default function* getColonyManager(): Generator<unknown, ColonyManager> {
  let colonyManager;
  try {
    colonyManager = getContext(ContextModule.ColonyManager);
    return colonyManager as ColonyManager;
  } catch (error) {
    // It means that the colony manager has not been instantiated yet
  }
  const networkClient = yield call(getNetworkClient);
  colonyManager = yield create(ColonyManager, networkClient);
  setContext(ContextModule.ColonyManager, colonyManager);
  return colonyManager as ColonyManager;
}
