import { defineMessages } from 'react-intl';
import omitDeep from 'omit-deep-lodash';
import { ColonyRole, Id } from '@colony/colony-js';

import { SUPPORTED_SAFE_NETWORKS } from '~constants';
import { Colony, Safe, SafeTransactionType } from '~types';
import { getChainNameFromSafe, getNetworkFromChainName } from '~utils/safes';
import { EnabledExtensionData, useActionDialogStatus } from '~hooks';

import { FormSafeTransaction } from './types';

const extractSafeName = (safeDisplayName: string) => {
  const pattern = /^(.*) \(/; // @NOTE: Matches any characters before a space and opening parenthesis
  const match = safeDisplayName.match(pattern);
  return match ? match[1] : ''; // @N0TE: Return the matched name or an empty string if no match
};

export const getControlSafeDialogPayload = (colony: Colony, payload: any) => {
  const { name: colonyName, colonyAddress } = colony;
  const {
    safe,
    customActionTitle,
    transactions,
    annotation: annotationMessage,
    motionDomainId,
  } = payload;

  const chainName = getChainNameFromSafe(safe.profile.displayName);
  const network = getNetworkFromChainName(chainName);

  const transformedSafe: Safe = {
    // Find will return because input value comes from SUPPORTED_SAFE_NETWORKS
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    chainId: SUPPORTED_SAFE_NETWORKS.find(
      (safeNetwork) => safeNetwork.name === chainName,
    )!.chainId,
    address: safe.walletAddress,
    moduleContractAddress: safe.id,
    name: extractSafeName(safe.profile.displayName),
  };
  const transformedTransactions = transactions.map(
    (transaction: any): FormSafeTransaction => {
      const dynamicPropNames =
        transaction.functionParamTypes?.map(
          (functionParamType) =>
            `${functionParamType.name}-${transaction.contractFunction}`,
        ) || [];
      const functionParams =
        transaction.functionParamTypes?.map(
          (param: any, index: number): any => {
            return {
              ...param,
              value: transaction[dynamicPropNames[index]],
            };
          },
        ) || [];
      const filteredTransaction = omitDeep(transaction, [
        ...dynamicPropNames,
        'functionParamTypes',
      ]);

      return {
        ...filteredTransaction,
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
          'meta',
        ]),
        nftData: omitDeep(transaction.nftData, ['metadata']),
        token: transaction.token
          ? {
              ...omitDeep(transaction.token, ['type']),
            }
          : null,
        functionParams,
      };
    },
  );

  return {
    safe: transformedSafe,
    customActionTitle,
    transactions: transformedTransactions,
    annotationMessage,
    colonyAddress,
    colonyName,
    motionDomainId,
    network,
  };
};

export const SafeTransactionMSG = defineMessages({
  [SafeTransactionType.TransferFunds]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${SafeTransactionType.TransferFunds}`,
    defaultMessage: 'Transfer funds',
  },
  [SafeTransactionType.TransferNft]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${SafeTransactionType.TransferNft}`,
    defaultMessage: 'Transfer NFT',
  },
  [SafeTransactionType.ContractInteraction]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${SafeTransactionType.ContractInteraction}`,
    defaultMessage: 'Contract interaction',
  },
  [SafeTransactionType.RawTransaction]: {
    id: `common.ControlSafeDialog.ControlSafeForm.${SafeTransactionType.RawTransaction}`,
    defaultMessage: 'Raw transaction',
  },
});

export const transactionOptions = Object.entries(SafeTransactionMSG).map(
  ([key, value]) => ({
    value: key,
    label: value,
  }),
);

export enum ContractFunctions {
  TRANSFER_FUNDS = 'transfer',
  TRANSFER_NFT = 'safeTransferFrom',
}

export const useControlSafeDialogStatus = (
  colony: Colony,
  requiredRoles: ColonyRole[],
  enabledExtensionData: EnabledExtensionData,
) => {
  const isSupportedColonyVersion = colony.version >= 12;
  const { disabledInput: defaultDisabledInput, ...rest } =
    useActionDialogStatus(
      colony,
      requiredRoles,
      [Id.RootDomain],
      enabledExtensionData,
    );
  const disabledInput = defaultDisabledInput || !isSupportedColonyVersion;

  return {
    ...rest,
    disabledInput,
    isSupportedColonyVersion,
  };
};
