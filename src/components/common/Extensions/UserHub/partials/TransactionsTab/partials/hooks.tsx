import React, { useCallback, useEffect, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ActionTypes } from '~redux';

import { useAsyncFunction } from '~hooks';
import { TransactionStatus } from '~gql';

import {
  transactionEstimateGas,
  transactionSend,
  transactionCancel,
} from '~redux/actionCreators';
import { withId } from '~utils/actions';
import { GasStationContext } from '~frame/GasStation';
import Toast from '~shared/Extensions/Toast';

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
    try {
      dispatch(transactionCancel(id));
      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionDeprecate.toast.title.success' }}
          description={{
            id: 'extensionDeprecate.toast.description.success',
          }}
        />,
      );
    } catch (err) {
      toast.error(
        <Toast type="error" title="Error" description="Something went wrong" />,
      );
      console.error(err);
    }
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

  const { updateTransactionAlert } = useContext(GasStationContext);

  useEffect(() => {
    if (!error) {
      if (metatransaction) {
        dispatch(transactionSend(id));
      } else {
        dispatch(transactionEstimateGas(id));
      }
    }
  }, [dispatch, id, error, metatransaction]);

  const handleResetMetaTransactionAlert = useCallback(
    () => updateTransactionAlert(id, { wasSeen: false }),
    [id, updateTransactionAlert],
  );

  const transform = useCallback(withId(id), [id]);
  const asyncFunction = useAsyncFunction({
    submit: ActionTypes.TRANSACTION_RETRY,
    error: ActionTypes.TRANSACTION_ERROR,
    success: ActionTypes.TRANSACTION_SENT,
    transform,
  });

  const handleRetryAction = useCallback(async () => {
    try {
      handleResetMetaTransactionAlert();
      await asyncFunction(id).then(() =>
        toast.success(
          <Toast
            type="success"
            title={{ id: 'extensionDeprecate.toast.title.success' }}
            description={{
              id: 'extensionDeprecate.toast.description.success',
            }}
          />,
        ),
      );
    } catch (err) {
      toast.error(
        <Toast type="error" title="Error" description="Something went wrong" />,
      );
      console.error(err);
    }
  }, [asyncFunction, id, handleResetMetaTransactionAlert]);

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
