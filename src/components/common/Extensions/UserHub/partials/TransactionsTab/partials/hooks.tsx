import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { TransactionStatus } from '~gql';
import {
  transactionEstimateGas,
  transactionCancel,
  transactionRetry,
} from '~redux/actionCreators/index.ts';
import Toast from '~shared/Extensions/Toast/index.ts';

export const useGroupedTransactionContent = (
  id,
  error,
  methodContext,
  methodName,
  metatransaction,
  context,
  status,
  selected,
) => {
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

  /*
   * Commenting this effect out for now.
   * I believe it's only useful for the old flow where the gas station would pop open automatically.
   */
  // useEffect(() => {
  //   if (!error) {
  //     if (metatransaction) {
  //       dispatch(transactionSend(id));
  //     } else {
  //       dispatch(transactionEstimateGas(id));
  //     }
  //   }
  // }, [dispatch, id, error, metatransaction]);

  // const transform = useCallback(() => withId(id), [id])();
  // const asyncFunction = useAsyncFunction({
  //   submit: ActionTypes.TRANSACTION_RETRY,
  //   error: ActionTypes.TRANSACTION_ERROR,
  //   success: ActionTypes.TRANSACTION_SENT,
  //   transform,
  // });

  const handleRetryAction = () => {
    dispatch(transactionRetry(id));
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
