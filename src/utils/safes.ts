import { ADDRESS_ZERO, SAFE_NETWORKS } from '~constants';
import { Safe } from '~gql';
import { Address, SafeBalance, SelectedSafe } from '~types';

export const getSafe = (safes: Safe[], selectedSafe: SelectedSafe | null) => {
  if (!selectedSafe) return undefined;

  return safes.find(
    (safe) =>
      safe.address === selectedSafe.profile.walletAddress &&
      safe.moduleContractAddress === selectedSafe.id,
  );
};

export const getSelectedSafeBalance = (
  safeBalances?: SafeBalance[] | null,
  selectedTokenAddress?: Address,
) =>
  safeBalances?.find(
    (balance) =>
      balance.token.tokenAddress === selectedTokenAddress ||
      (!balance.token.tokenAddress && selectedTokenAddress === ADDRESS_ZERO),
  );

export const getChainNameFromSafe = (safeDisplayName: string) => {
  return safeDisplayName.match(/\(([^()]*)\)$/)?.pop() || '';
};

export const getTxServiceBaseUrl = (selectedChain: string) => {
  const selectedNetwork = SAFE_NETWORKS.find(
    (network) => network.name === selectedChain,
  );

  if (!selectedNetwork || !selectedNetwork.safeTxService) {
    throw new Error(`Selected chain ${selectedChain} not currently supported.`);
  }

  return selectedNetwork.safeTxService;
};
