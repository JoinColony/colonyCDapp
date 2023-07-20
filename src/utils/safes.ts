import { ADDRESS_ZERO, SAFE_NAMES_MAP, SAFE_NETWORKS } from '~constants';
import { Address, ColonyAction, SafeBalance, SelectedSafe, Safe } from '~types';

export const getSafe = (safes: Safe[], selectedSafe: SelectedSafe | null) => {
  if (!selectedSafe) return undefined;

  return safes.find(
    (safe) =>
      safe.address === selectedSafe.walletAddress &&
      safe.moduleContractAddress === selectedSafe.id,
  );
};

export const getSelectedSafeBalance = (
  safeBalances?: SafeBalance[] | null,
  selectedTokenAddress?: Address,
) =>
  safeBalances?.find(
    (balance) =>
      balance.tokenAddress === selectedTokenAddress ||
      (!balance.tokenAddress && selectedTokenAddress === ADDRESS_ZERO),
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

export const getAddedSafe = (actionData: ColonyAction) => {
  const actionChangelog = actionData.colony.metadata?.changelog?.find(
    (changelog) => changelog.transactionHash === actionData.transactionHash,
  );
  const newSafes: Safe[] = actionChangelog?.newSafes || [];
  const oldSafes: Safe[] = actionChangelog?.oldSafes || [];

  if (newSafes.length > oldSafes.length) {
    const addedSafe = newSafes[newSafes.length - 1];
    return addedSafe;
  }

  return null;
};

export const getAddedSafeChainName = (actionData: ColonyAction) => {
  const addedSafe = getAddedSafe(actionData);

  if (addedSafe) {
    return SAFE_NAMES_MAP[addedSafe.chainId];
  }

  return null;
};

export const getRemovedSafes = (actionData: ColonyAction) => {
  const actionChangelog = actionData.colony.metadata?.changelog?.find(
    (changelog) => changelog.transactionHash === actionData.transactionHash,
  );
  const newSafes: Safe[] = actionChangelog?.newSafes || [];
  const oldSafes: Safe[] = actionChangelog?.oldSafes || [];

  if (newSafes.length < oldSafes.length) {
    const removedSafes = oldSafes.filter(
      (safe) =>
        !newSafes.some(
          (newSafe) =>
            newSafe.address === safe.address &&
            Number(newSafe.chainId) === safe.chainId,
        ),
    );
    return removedSafes;
  }

  return null;
};
