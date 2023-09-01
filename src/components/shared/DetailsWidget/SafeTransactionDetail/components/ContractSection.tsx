import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Safe, SafeTransactionData, SafeTransactionType } from '~types';
import { intl } from '~utils/intl';
import { extractTokenName } from '~utils/safes';
import { InvisibleCopyableMaskedAddress } from '~shared/InvisibleCopyableAddress';
import { getNativeTokenByChainId } from '~utils/tokens';

import { ContractName } from '../../SafeTransactionDetail';
import widgetStyles from '../../DetailsWidget.css';

const displayName = 'DetailsWidget.SafeTransactionDetail.ContractSection';

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
  transaction: SafeTransactionData;
  safe: Safe;
  hideFunctionContract?: boolean;
}

export const ContractSection = ({
  transaction,
  safe,
  hideFunctionContract,
}: ContractSectionProps) => {
  const nativeToken = getNativeTokenByChainId(safe.chainId);

  const getContractInfo = (safeTransaction: SafeTransactionData) => {
    const { formatMessage } = intl();
    const { transactionType } = safeTransaction;
    const contractInfo = {
      contractName: safe.name,
      contractAddress: safe.address,
    };

    switch (transactionType) {
      case SafeTransactionType.TransferNft:
        contractInfo.contractName =
          extractTokenName(
            safeTransaction.nftData?.name ||
              safeTransaction.nftData?.tokenName ||
              '',
          ) || formatMessage(MSG.nft);
        contractInfo.contractAddress =
          safeTransaction.nftData?.address || safe.address;
        break;
      case SafeTransactionType.TransferFunds:
        contractInfo.contractName =
          safeTransaction.token?.name ||
          nativeToken.name ||
          formatMessage(MSG.token);
        contractInfo.contractAddress =
          safeTransaction.token?.tokenAddress ||
          nativeToken.tokenAddress ||
          safe.address;
        break;
      case SafeTransactionType.ContractInteraction:
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

  const getTransferFundsFunctionContract = () => {
    if (transaction.transactionType === SafeTransactionType.TransferFunds) {
      return transaction.token?.tokenAddress || nativeToken.tokenAddress;
    }

    return undefined;
  };

  const functionContract =
    transaction.contract?.id ||
    transaction.contract?.walletAddress ||
    transaction.nftData?.address ||
    getTransferFundsFunctionContract();

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
