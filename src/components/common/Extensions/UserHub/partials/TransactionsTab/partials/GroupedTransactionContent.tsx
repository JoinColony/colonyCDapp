import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

import { type GroupedTransactionContentProps } from '../types.ts';

import CancelTransaction from './CancelTransaction.tsx';
import { useGroupedTransactionContent } from './hooks.tsx';
import transactionsItemClasses from './TransactionsItem/TransactionsItem.styles.ts';
import TransactionStatus from './TransactionStatus.tsx';
import { shortErrorMessage } from './utils.ts';

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
  idx,
  selected,
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
  const {
    defaultTransactionMessageDescriptorId,
    handleRetryAction,
    failed,
    pending,
    succeeded,
    isShowingCancelConfirmation,
    toggleCancelConfirmation,
    handleCancelTransaction,
    canBeSigned,
  } = useGroupedTransactionContent(
    id,
    error,
    methodContext,
    methodName,
    metatransaction,
    context,
    status,
    selected,
  );

  return (
    <li
      className={clsx(`${transactionsItemClasses.listItem}`, {
        'before:bg-success-400': succeeded,
        'before:bg-negative-400': failed,
        'before:bg-blue-400': pending,
        'font-semibold': selected,
      })}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-gray-900">
          {`${(group?.index || idx) + 1}. `}{' '}
          <FormattedMessage
            {...defaultTransactionMessageDescriptorId}
            {...title}
            values={(titleValues || params) as Record<string, any>}
          />
        </h4>

        {canBeSigned ? (
          <CancelTransaction
            isShowingCancelConfirmation={isShowingCancelConfirmation}
            handleCancelTransaction={handleCancelTransaction}
            toggleCancelConfirmation={toggleCancelConfirmation}
          />
        ) : (
          <TransactionStatus status={status} hasError={!!error} />
        )}
      </div>
      {failed && error && (
        <div className="mt-2 md:mr-2">
          <NotificationBanner
            status="error"
            callToActionClassName="w-full"
            callToAction={
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleRetryAction}
                  className="underline hover:no-underline"
                >
                  <FormattedMessage id="retry" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelTransaction}
                  className="underline hover:no-underline"
                >
                  <FormattedMessage id="cancel" />
                </button>
              </div>
            }
          >
            <p className="text-sm font-normal">
              <FormattedMessage
                {...MSG.failedTx}
                values={{
                  type: error.type,
                  message: shortErrorMessage(error.message),
                }}
              />
            </p>
          </NotificationBanner>
        </div>
      )}
    </li>
  );
};

GroupedTransactionContent.displayName = displayName;

export default GroupedTransactionContent;
