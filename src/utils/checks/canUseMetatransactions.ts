import { NETWORKS_WITH_METATRANSACTIONS, DEFAULT_NETWORK } from '~constants';

/*
 * There's only two conditions for the user to actually send metatransactions, rather
 * than "normal" ones, besides the user actually turning them on/off
 * 1. The Dapp needs to be deployed to Xdai, that's the only place the Broadcaster works
 * (We also add QA Xdai, and if started in dev mode, the local Ganache network)
 *
 * 2. The global ENV switch needs to be turned on. This is in place for when the
 * broadcaster runs out of funds and we need to emergency shut down the system
 */
export const canUseMetatransactions = (): boolean => {
  const networkSupportsMetatransactions = NETWORKS_WITH_METATRANSACTIONS.find((network) => network === DEFAULT_NETWORK);
  const areMetaTransactionsEnabled = !!process.env.METATRANSACTIONS || false;
  return !!networkSupportsMetatransactions && areMetaTransactionsEnabled;
};
