import React, { useCallback, FC, useEffect, useContext } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { ActionTypes } from '~redux';
import { useAsyncFunction } from '~hooks';
import { TRANSACTION_STATUSES } from '~types';

import { transactionEstimateGas, transactionSend } from '~redux/actionCreators';
import Icon from '~shared/Icon/Icon';
import styles from '../partials/TransactionsItem/TransactionsItem.module.css';
import NotificationBanner from '~common/Extensions/NotificationBanner/NotificationBanner';
import { GroupedTransactionContentProps } from '../types';
import { withId } from '~utils/actions';
import { GasStationContext } from '~frame/GasStation';
import Toast from '~shared/Extensions/Toast';

const displayName =
  'common.Extensions.UserHub.partials.TransactionsTab.partials.GroupedTransactionCard';

const MSG = defineMessages({
  failedTx: {
    id: `${displayName}.failedTx`,
    defaultMessage: `{type, select,
      ESTIMATE {Estimation error}
      EVENT_DATA {Event data error}
      RECEIPT {Receipt error}
      SEND {Send error}
      UNSUCCESSFUL {Unsuccessful}
      other {}
      }: {message}`,
  },
});

const GroupedTransactionContent: FC<GroupedTransactionContentProps> = ({
  // appearance: { required },
  // selectedTransaction,
  idx,
  // selected,
  transaction: {
    context,
    error,
    id,
    methodContext,
    methodName,
    params,
    status,
    group,
    metatransaction,
    title,
    titleValues,
  },
}) => {
  // const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  // const handleCancel = useCallback(() => {
  //   dispatch(transactionCancel(id));
  // }, [dispatch, id]);

  // const [isShowingCancelConfirmation, setIsShowingCancelConfirmation] =
  //   useState(false);

  // const toggleCancelConfirmation = useCallback(() => {
  //   setIsShowingCancelConfirmation(!isShowingCancelConfirmation);
  // }, [isShowingCancelConfirmation]);

  // const ready = status === TRANSACTION_STATUSES.READY;
  const failed = status === TRANSACTION_STATUSES.FAILED;
  // const succeeded = status === TRANSACTION_STATUSES.SUCCEEDED;
  const pending = status === TRANSACTION_STATUSES.PENDING;

  // Only transactions that can be signed can be cancelled
  // const canBeSigned = selected && ready;

  // A prior transaction was selected
  // const hasDependency = ready && !selected;

  const defaultTransactionMessageDescriptorId = {
    id: `${metatransaction ? 'meta' : ''}transaction.${
      context ? `${context}.` : ''
    }${methodName}.${methodContext ? `${methodContext}.` : ''}title`,
  };

  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps

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

  // @ts-ignore
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

  return (
    <li
      className={clsx(`${styles.listItem} font-semibold text-gray-900`, {
        'before:bg-success-400':
          status === TRANSACTION_STATUSES.READY ||
          status === TRANSACTION_STATUSES.SUCCEEDED,
        'before:bg-negative-400': status === TRANSACTION_STATUSES.FAILED,
        'before:!bg-blue-400': pending,
      })}
    >
      <div className="flex justify-between items-center">
        <h4>
          {`${(group?.index || idx) + 1}. `}{' '}
          <FormattedMessage
            {...defaultTransactionMessageDescriptorId}
            {...title}
            values={(titleValues || params) as Record<string, any>}
          />
        </h4>
        {!pending ? (
          <div
            className={clsx('flex ml-2', {
              'text-success-400':
                status === TRANSACTION_STATUSES.READY ||
                status === TRANSACTION_STATUSES.SUCCEEDED,
              'text-negative-400': TRANSACTION_STATUSES.FAILED,
            })}
          >
            <Icon
              name={
                status === TRANSACTION_STATUSES.READY ||
                status === TRANSACTION_STATUSES.SUCCEEDED
                  ? 'check-circle'
                  : 'warning-circle'
              }
              appearance={{ size: 'tiny' }}
            />
          </div>
        ) : (
          <Icon
            name="spinner-gap"
            className="ml-[0.59375rem] w-[0.8125rem] h-[0.8125rem] animate-spin text-blue-400"
            appearance={{ size: 'tiny' }}
          />
        )}
      </div>
      {failed && error && (
        <div className="mt-2 md:max-w-[24rem]">
          <NotificationBanner
            status={failed && error && 'error'}
            actionText={formatMessage({ id: 'retry' })}
            actionType="call-to-action"
            isAlt
            onClick={handleRetryAction}
          >
            <FormattedMessage {...MSG.failedTx} values={{ ...error }} />
          </NotificationBanner>
        </div>
      )}
    </li>
  );
};

GroupedTransactionContent.displayName = displayName;

export default GroupedTransactionContent;
