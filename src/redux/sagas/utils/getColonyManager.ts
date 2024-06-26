import {
  getContext,
  setContext,
  ContextModule,
  ColonyManager,
} from '~context/index.ts';

import getNetworkClient from './getNetworkClient.ts';

/*
 * Return an initialized ColonyManager instance.
 */
const getColonyManager = async () => {
  let colonyManager: ColonyManager;
  try {
    colonyManager = getContext(ContextModule.ColonyManager);
    return colonyManager as ColonyManager;
  } catch (error) {
    // It means that the colony manager has not been instantiated yet
  }
  const networkClient = await getNetworkClient();
  colonyManager = new ColonyManager(networkClient);
  setContext(ContextModule.ColonyManager, colonyManager);
  return colonyManager;
};

export default getColonyManager;
