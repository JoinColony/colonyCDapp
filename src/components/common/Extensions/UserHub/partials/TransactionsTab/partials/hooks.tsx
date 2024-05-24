import { type ClientType } from '@colony/colony-js';
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
import { type ExtendedClientType } from '~types/transactions.ts';

import { transactionRetry } from '../../../../../../../state/transactionState.ts';

export const useGroupedTransactionContent = ({
  id,
  methodContext,
  methodName,
  metatransaction,
  context,
  status,
  selected,
}: {
  id: TransactionId;
  methodContext: string | undefined;
  methodName: string;
  metatransaction: boolean;
  context: ClientType | ExtendedClientType;
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

  const defaultTransactionMessageDescriptorId = {
    id: `${metatransaction ? 'meta' : ''}transaction.${
      context ? `${context}.` : ''
    }${methodName}.${methodContext ? `${methodContext}.` : ''}title`,
  };

  const handleRetryAction = async () => {
    await transactionRetry(id);
    dispatch(transactionEstimateGas(id));
  };

  return {
    defaultTransactionMessageDescriptorId,
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
