import { ADDRESS_ZERO, SAFE_NAMES_MAP, SAFE_NETWORKS } from '~constants';
import {
  Address,
  ColonyAction,
  SafeBalance,
  SelectedPickerItem,
  Safe,
  NFTData,
} from '~types';

export {
  getContractUsefulMethods,
  AbiItemExtended,
  fetchContractABI,
  isAbiItem,
  fetchContractName,
} from './getContractUsefulMethods';

export { getArrayFromString } from './contractParserValidation';

export const getSafe = (
  safes: Safe[],
  selectedSafe: SelectedPickerItem | null,
) => {
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
      balance?.token?.tokenAddress === selectedTokenAddress ||
      (!balance?.token?.tokenAddress && selectedTokenAddress === ADDRESS_ZERO),
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

// in the event the token id is also appended to the token name
export const extractTokenName = (tokenName: string) => {
  const chunks = tokenName.trim().split(' ');
  // using 'starts with #' to identify a token id
  if (chunks[chunks.length - 1].startsWith('#')) {
    return chunks.slice(0, chunks.length - 1).join(' ');
  }

  return tokenName;
};

const getTokenIdFromNFTId = (nftId: string) => {
  const chunks = nftId.split(' ');
  return chunks[chunks.length - 1];
};

export const getSelectedNFTData = (
  selectedNFT: SelectedPickerItem,
  availableNFTs: NFTData[],
) =>
  availableNFTs.find((nft) => {
    const tokenId = getTokenIdFromNFTId(selectedNFT.id);
    return nft.address === selectedNFT.walletAddress && nft.id === tokenId;
  });

export const nftNameContainsTokenId = (tokenName: string): boolean => {
  const chunks = tokenName.trim().split(' ');
  // using 'starts with #' to identify a token id
  if (chunks[chunks.length - 1].startsWith('#')) {
    return true;
  }

  return false;
};
