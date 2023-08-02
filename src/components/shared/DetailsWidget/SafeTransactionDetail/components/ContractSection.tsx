import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Safe, SafeTransaction } from '~types';
import { intl } from '~utils/intl';
import { TransactionTypes } from '~common/Dialogs/ControlSafeDialog/helpers';
import { extractTokenName } from '~utils/safes';

import { ContractName } from '../../SafeTransactionDetail';
import widgetStyles from '../../DetailsWidget.css';

import { InvisibleCopyableMaskedAddress } from './InvisibleCopyableMaskedAddress';

const displayName = 'DetailsWidget.SafeTransactionDetail';

const MSG = defineMessages({
  function: {
    id: `${displayName}.function`,
    defaultMessage: 'Function',
  },
  nft: {
    id: `${displayName}.nft`,
    defaultMessage: 'NFT',
  },
  token: {
    id: `${displayName}.token`,
    defaultMessage: 'Token',
  },
  unknownContract: {
    id: `${displayName}.unknownContract`,
    defaultMessage: 'Unknown',
  },
  contractAddress: {
    id: `${displayName}.contractAddress`,
    defaultMessage: 'Contract address',
  },
});

export const { unknownContract: unknownContractMSG, nft: nftMSG } = MSG;

export interface ContractSectionProps {
  transaction: SafeTransaction;
  safe: Safe;
  hideFunctionContract?: boolean;
}

export const ContractSection = ({
  transaction,
  safe,
  hideFunctionContract,
}: ContractSectionProps) => {
  const functionContract =
    /* NOTE to self this might be an issue
    transaction.contract?.id || */
    transaction.contract?.walletAddress ||
    transaction.tokenData?.tokenAddress ||
    transaction.nftData?.address;

  const getContractInfo = (safeTransaction: SafeTransaction) => {
    const { formatMessage } = intl();
    const { transactionType } = safeTransaction;
    const contractInfo = {
      contractName: safe.name,
      contractAddress: safe.address,
    };

    switch (transactionType) {
      case TransactionTypes.TRANSFER_NFT:
        contractInfo.contractName =
          extractTokenName(
            safeTransaction.nftData?.name ||
              safeTransaction.nftData?.tokenName ||
              '',
          ) || formatMessage(MSG.nft);
        contractInfo.contractAddress =
          safeTransaction.nftData?.address || safe.address;
        break;
      case TransactionTypes.TRANSFER_FUNDS:
        contractInfo.contractName =
          safeTransaction.tokenData?.name || formatMessage(MSG.token);
        contractInfo.contractAddress =
          safeTransaction.tokenData?.tokenAddress || safe.address;
        break;
      case TransactionTypes.CONTRACT_INTERACTION:
        contractInfo.contractName =
          safeTransaction.contract?.profile?.displayName ||
          formatMessage(MSG.unknownContract);
        contractInfo.contractAddress =
          safeTransaction.contract?.walletAddress || safe.address;
        break;
      default:
        break;
    }

    return contractInfo;
  };

  const { contractName, contractAddress } = getContractInfo(transaction);

  return (
    <>
      <ContractName name={contractName} address={contractAddress} />
      {functionContract && !hideFunctionContract && (
        <div className={widgetStyles.item}>
          <div className={widgetStyles.label}>
            <FormattedMessage {...MSG.contractAddress} />
          </div>
          <div className={widgetStyles.value}>
            <InvisibleCopyableMaskedAddress address={functionContract} />
          </div>
        </div>
      )}
      {transaction.contractFunction && (
        <div className={widgetStyles.item}>
          <div className={widgetStyles.label}>
            <FormattedMessage {...MSG.function} />
          </div>
          <div className={widgetStyles.value}>
            <span>{transaction.contractFunction}</span>
          </div>
        </div>
      )}
    </>
  );
};
