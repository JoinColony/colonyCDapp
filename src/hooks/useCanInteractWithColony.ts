import { DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useGetColonyContributorQuery } from '~gql';
import { type Colony } from '~types/graphql.ts';
import { type ColonyWallet } from '~types/wallet.ts';
import { isChainSupported } from '~utils/autoLogin.ts';
import { getChainIdFromHex } from '~utils/chainId.ts';
import { getColonyContributorId } from '~utils/members.ts';

export const useUserAccountRegistered = (): boolean => {
  const { user } = useAppContext();
  /*
   * Short circuit early
   */
  if (!user) {
    return false;
  }
  return !!user.profile?.displayName;
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
  const colonyChainId =
    colony?.chainMetadata?.chainId || DEFAULT_NETWORK_INFO.chainId;
  const userWalletChainId = getChainIdFromHex(walletHexChainId);

  return colonyChainId === userWalletChainId;
};

/*
 * @TODO Eventually, this should
 * - Include roles / permissions into the check
 */
export const useCanInteractWithColony = (colony?: Colony): boolean => {
  const { wallet } = useAppContext();
  const { address: walletAddress = '' } = wallet || {};
  const { colonyAddress = '' } = colony || {};
  const canInteractWithNetwork = useCanInteractWithNetwork();

  const colonyContributorId = getColonyContributorId(
    colonyAddress,
    walletAddress,
  );

  const { data, loading } = useGetColonyContributorQuery({
    variables: { id: colonyContributorId, colonyAddress },
    skip: !colonyAddress || !walletAddress,
  });

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
  const isWatching =
    Boolean(data?.getColonyContributor?.isWatching) && !loading;

  return sameChain && canInteractWithNetwork && isWatching;
};

export const useCanJoinColony = (isWatching: boolean, colony?: Colony) => {
  const { wallet } = useAppContext();
  const sameChain = isUserAndColonyOnSameChain(wallet, colony);
  const canInteractWithNetwork = useCanInteractWithNetwork();

  return sameChain && canInteractWithNetwork && !isWatching;
};
