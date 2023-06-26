import { Colony, ColonyWallet } from '~types';
import { DEFAULT_NETWORK_INFO } from '~constants';
import { getWatchedColony } from '~utils/watching';
import { isChainSupported } from '~utils/autoLogin';

import useAppContext from './useAppContext';
import useColonyContext from './useColonyContext';

export const useUserAccountRegistered = (): boolean => {
  const { user } = useAppContext();
  /*
   * Short circuit early
   */
  if (!user) {
    return false;
  }
  return !!user.name;
};

export const useCanInteractWithNetwork = (): boolean => {
  const { wallet } = useAppContext();
  const userAccountRegistered = useUserAccountRegistered();
  /*
   * Short circuit early
   */
  if (!wallet) {
    return false;
  }
  const [{ id: hexChainId }] = wallet.chains;

  const networkContractsAvailable = isChainSupported(hexChainId);

  return userAccountRegistered && networkContractsAvailable;
};

const isUserAndColonyOnSameChain = (
  wallet?: ColonyWallet | null,
  colony?: Colony,
) => {
  if (!wallet) {
    return false;
  }

  /*
   * Check if connected to the same chain
   */
  const [{ id: walletHexChainId }] = wallet.chains;
  const colonyChain =
    colony?.chainMetadata?.chainId || DEFAULT_NETWORK_INFO.chainId;
  const userWalletChain = parseInt(walletHexChainId.slice(2), 16);

  return colonyChain === userWalletChain;
};

/*
 * @TODO Eventually, this should
 * - Include roles / permissions into the check
 */
export const useCanInteractWithColony = (colony?: Colony): boolean => {
  const { wallet, user } = useAppContext();
  const canInteractWithNetwork = useCanInteractWithNetwork();

  /*
   * Short circuit early
   */
  if (!wallet || !colony) {
    return false;
  }

  const sameChain = isUserAndColonyOnSameChain(wallet, colony);
  /*
   * Checking if watching (following) or not
   */
  const isWatching = !!getWatchedColony(colony, user?.watchlist?.items);

  return sameChain && canInteractWithNetwork && isWatching;
};

export const useCanJoinColony = () => {
  const { colony } = useColonyContext();
  const { user, wallet } = useAppContext();
  const sameChain = isUserAndColonyOnSameChain(wallet, colony);
  const canInteractWithNetwork = useCanInteractWithNetwork();
  const isAlreadyJoined = !!getWatchedColony(colony, user?.watchlist?.items);

  return sameChain && canInteractWithNetwork && !isAlreadyJoined;
};
