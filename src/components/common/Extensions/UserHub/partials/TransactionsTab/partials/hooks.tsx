import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { TransactionStatus } from '~gql';
import {
  transactionEstimateGas,
  transactionCancel,
} from '~redux/actionCreators/index.ts';
import { type TransactionId } from '~redux/immutable/index.ts';
import Toast from '~shared/Extensions/Toast/index.ts';

import { transactionRetry } from '../../../../../../../state/transactionState.ts';

export const useGroupedTransactionContent = ({
  id,
  status,
  selected,
}: {
  id: TransactionId;
  status: TransactionStatus;
  selected: boolean;
}) => {
  const dispatch = useDispatch();

  const handleCancelTransaction = useCallback(() => {
    dispatch(transactionCancel(id));
    toast.success(
      <Toast
        type="success"
        title={{ id: 'transaction.cancel.title' }}
        description={{
          id: 'transaction.cancel.description',
        }}
      />,
    );
  }, [dispatch, id]);

  const [isShowingCancelConfirmation, setIsShowingCancelConfirmation] =
    useState(false);

  const toggleCancelConfirmation = useCallback(() => {
    setIsShowingCancelConfirmation(!isShowingCancelConfirmation);
  }, [isShowingCancelConfirmation]);

  const ready = status === TransactionStatus.Ready;
  const failed = status === TransactionStatus.Failed;
  const succeeded = status === TransactionStatus.Succeeded;
  const pending = status === TransactionStatus.Pending;

  // Only transactions that can be signed can be cancelled
  const canBeSigned: boolean = selected && ready;

  // A prior transaction was selected
  // const hasDependency = ready && !selected;

  const handleRetryAction = async () => {
    await transactionRetry(id);
    dispatch(transactionEstimateGas(id));
  };

  return {
    handleRetryAction,
    failed,
    ready,
    pending,
    succeeded,
    isShowingCancelConfirmation,
    toggleCancelConfirmation,
    handleCancelTransaction,
    canBeSigned,
  };
};
