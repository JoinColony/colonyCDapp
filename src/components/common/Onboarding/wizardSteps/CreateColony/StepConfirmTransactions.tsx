import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

import GroupedTransaction from '~common/Extensions/UserHub/partials/TransactionsTab/partials/GroupedTransaction.tsx';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { TransactionStatus } from '~gql';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import {
  findTransactionGroupByKey,
  getGroupStatus,
  useGroupedTransactions,
} from '~state/transactionState.ts';
import { formatText } from '~utils/intl.ts';

import HeaderRow from '../HeaderRow.tsx';

const displayName = 'common.CreateColonyWizard.StepConfirmTransactions';

const MSG = defineMessages({
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Deploying to the blockchain requires you to sign a transaction in your wallet for each step.',
  },
  goBack: {
    id: `${displayName}.goBack`,
    defaultMessage: `go back`,
  },
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Complete setup',
  },
  loadingTransactions: {
    id: `${displayName}.loadingTransactions`,
    defaultMessage: `Waiting for transactions to be created...`,
  },
  loadingColony: {
    id: `${displayName}.loadingColony`,
    defaultMessage: `Waiting for your colony to exist...`,
  },
  someFailed: {
    id: `${displayName}.someFailed`,
    defaultMessage: `Some transactions failed. Feel free to retry them individaully or {goBack} to start over`,
  },
});

const StepConfirmTransactions = () => {
  const { user, updateUser } = useAppContext();

  const { transactions } = useGroupedTransactions();

  const [createColonyTxs, setCreateColonyTxs] = useState<
    (typeof transactions)[0] | null
  >(null);

  // Find the first colonyCreation tx group that is still pending and then set it to the colony creation tx group
  useEffect(() => {
    const txGroup = findTransactionGroupByKey(transactions, 'createColony');
    if (!txGroup) {
      return;
    }
    const groupStatus = getGroupStatus(txGroup);
    if (groupStatus === TransactionStatus.Succeeded) {
      return;
    }

    setCreateColonyTxs(txGroup);
  }, [transactions]);

  const groupStatus = createColonyTxs
    ? getGroupStatus(createColonyTxs)
    : TransactionStatus.Pending;

  useEffect(() => {
    if (groupStatus === TransactionStatus.Succeeded) {
      updateUser(user?.walletAddress, true);
    }
  }, [groupStatus, updateUser, user]);

  if (!createColonyTxs) {
    return (
      <>
        <HeaderRow heading={MSG.heading} description={MSG.description} />
        <SpinnerLoader />
      </>
    );
  }

  return (
    <>
      <HeaderRow heading={MSG.heading} description={MSG.description} />
      <GroupedTransaction
        transactionGroup={createColonyTxs}
        isContentOpened
        hideSummary
        isClickable={false}
        isCancelable={false}
      />
      {groupStatus === TransactionStatus.Succeeded && (
        <div className="mt-8 text-center text-sm text-gray-600">
          <SpinnerLoader />
          <span className="ml-2 align-text-bottom">
            {formatText(MSG.loadingColony)}
          </span>
        </div>
      )}
    </>
  );
};

StepConfirmTransactions.displayName = displayName;

export default StepConfirmTransactions;
