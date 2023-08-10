import { defineMessages } from 'react-intl';
import omitDeep from 'omit-deep-lodash';

import { SAFE_NETWORKS } from '~constants';
import { Colony, Safe, SafeTransactionData } from '~types';
import { TransactionTypes, getChainNameFromSafe } from '~utils/safes';

const extractSafeName = (safeDisplayName: string) => {
  const pattern = /^(.*) \(/; // @NOTE: Matches any characters before a space and opening parenthesis
  const match = safeDisplayName.match(pattern);
  return match ? match[1] : ''; // @N0TE: Return the matched name or an empty string if no match
};

export const getControlSafeDialogPayload = (colony: Colony, payload: any) => {
  const { name: colonyName, colonyAddress } = colony;
  const {
    safe,
    transactionsTitle,
    transactions,
    annotation: annotationMessage,
    motionDomainId,
  } = payload;

  const chainName = getChainNameFromSafe(safe.profile.displayName);
  const transformedSafe: Safe = {
    // Find will return because input value comes from SAFE_NETWORKS
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    chainId: SAFE_NETWORKS.find((network) => network.name === chainName)!
      .chainId,
    address: safe.walletAddress,
    moduleContractAddress: safe.id,
    name: extractSafeName(safe.profile.displayName),
  };
  const transformedTransactions = transactions.map(
    (transaction: any): SafeTransactionData => {
      return {
        ...transaction,
        rawAmount: String(transaction.rawAmount),
        recipient: omitDeep(transaction.recipient, [
          '__typename',
          'avatar',
          'bio',
          'email',
          'location',
          'name',
          'thumbnail',
          'website',
        ]),
        nftData: omitDeep(transaction.nftData, ['metadata']),
        token: transaction.token
          ? {
              ...omitDeep(transaction.token, [
                'thumbnail',
                'tokenAddress',
                'type',
              ]),
              address: transaction.token.tokenAddress,
            }
          : null,
      };
    },
  );

  return {
    safe: transformedSafe,
    transactionsTitle,
    transactions: transformedTransactions,
    annotationMessage,
    colonyAddress,
    colonyName,
    motionDomainId,
  };
};

export const MSG = defineMessages({
  [TransactionTypes.TRANSFER_FUNDS]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${TransactionTypes.TRANSFER_FUNDS}`,
    defaultMessage: 'Transfer funds',
  },
  [TransactionTypes.TRANSFER_NFT]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${TransactionTypes.TRANSFER_NFT}`,
    defaultMessage: 'Transfer NFT',
  },
  [TransactionTypes.CONTRACT_INTERACTION]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${TransactionTypes.CONTRACT_INTERACTION}`,
    defaultMessage: 'Contract interaction',
  },
  [TransactionTypes.RAW_TRANSACTION]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${TransactionTypes.RAW_TRANSACTION}`,
    defaultMessage: 'Raw transaction',
  },
});

export const transactionOptions = [
  {
    value: TransactionTypes.TRANSFER_FUNDS,
    label: MSG[TransactionTypes.TRANSFER_FUNDS],
  },
  {
    value: TransactionTypes.TRANSFER_NFT,
    label: MSG[TransactionTypes.TRANSFER_NFT],
  },
  {
    value: TransactionTypes.CONTRACT_INTERACTION,
    label: MSG[TransactionTypes.CONTRACT_INTERACTION],
  },
  {
    value: TransactionTypes.RAW_TRANSACTION,
    label: MSG[TransactionTypes.RAW_TRANSACTION],
  },
];

export enum ContractFunctions {
  TRANSFER_FUNDS = 'transfer',
  TRANSFER_NFT = 'safeTransferFrom',
}
