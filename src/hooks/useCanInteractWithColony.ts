import useAppContext from './useAppContext';

import { Colony } from '~types';
import { DEFAULT_NETWORK_INFO } from '~constants';

/*
 * @TODO Eventually, this should be
 * - Encapsulated in `ColonyProvider`, once that gets added via #67
 * - Include roles / permissions into the check
 */
const useCanInteractWithColony = (colony: Colony): boolean => {
  const { user, wallet } = useAppContext();
  /*
   * Short circuit early
   */
  if (!wallet || !user || !colony) {
    return false;
  }
  const [{ id: walletHexChainId }] = wallet.chains;
  const colonyChain = colony?.meta?.chainId || DEFAULT_NETWORK_INFO.chainId;
  const userWalletChain = parseInt(walletHexChainId.slice(2), 16);
  const userAccountRegistered = !!user.name;
  return colonyChain === userWalletChain && userAccountRegistered;
};

export default useCanInteractWithColony;
