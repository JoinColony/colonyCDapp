import {
  ADDRESS_ZERO,
  SAFE_NAMES_MAP,
  SUPPORTED_SAFE_NETWORKS,
} from '~constants';
import {
  Address,
  ColonyAction,
  SafeBalance,
  SelectedPickerItem,
  Safe,
  NFTData,
  ExtendedColonyActionType,
  FormSafeTransaction,
} from '~types';
import { notNull } from '~utils/arrays';
import { isEmpty } from '~utils/lodash';

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

export const getNetworkFromChainName = (chainName: string) => {
  const network = SUPPORTED_SAFE_NETWORKS.find(
    (safeNetwork) => safeNetwork.name === chainName,
  );

  if (!network) {
    throw new Error(`Network ${chainName} not found`);
  }

  return network;
};

export const getTxServiceBaseUrl = (selectedChain: string) => {
  const selectedNetwork = getNetworkFromChainName(selectedChain);

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

export const defaultTransaction: FormSafeTransaction = {
  transactionType: undefined,
  token: undefined,
  amount: undefined,
  rawAmount: undefined,
  recipient: undefined,
  data: '',
  contract: undefined,
  abi: '',
  contractFunction: '',
  nft: undefined,
  nftData: undefined,
  functionParamTypes: undefined,
};

export const parseSafeTransactionType = (actionData: ColonyAction) => {
  const safeTransactionDetails =
    actionData.safeTransaction?.transactions?.items.filter(notNull) || [];

  if (safeTransactionDetails.length > 1) {
    return ExtendedColonyActionType.SafeMultipleTransactions;
  }

  if (safeTransactionDetails.length > 0) {
    const actionType = `SAFE_${safeTransactionDetails[0].transactionType}`;

    if (!isEmpty(actionData.motionData)) {
      return `${actionType}_MOTION` as ExtendedColonyActionType;
    }

    return actionType as ExtendedColonyActionType;
  }

  return undefined;
};
