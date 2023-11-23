import React, { FC } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import clsx from 'clsx';

import styles from './TransactionsItem/TransactionsItem.module.css';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import { GroupedTransactionContentProps } from '../types';
import { useGroupedTransactionContent } from './hooks';
import CancelTransaction from './CancelTransaction';
import TransactionStatus from './TransactionStatus';
import { shortErrorMessage } from './utils';

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
      className={clsx(`${styles.listItem}`, {
        'before:bg-success-400': succeeded,
        'before:bg-negative-400': failed,
        'before:bg-blue-400': pending,
        'font-semibold': selected,
      })}
    >
      <div className="flex justify-between items-center">
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
          <TransactionStatus status={status} />
        )}
      </div>
      {failed && error && (
        <div className="mt-2 md:max-w-[24rem]">
          {/* @TODO check how this one looks before the rework */}
          <NotificationBanner
            status="error"
            callToAction={
              <button type="button" onClick={handleRetryAction}>
                <FormattedMessage id="retry" />
              </button>
            }
            isAlt
          >
            <FormattedMessage
              {...MSG.failedTx}
              values={{
                type: error.type,
                message: shortErrorMessage(error.message),
              }}
            />
          </NotificationBanner>
        </div>
      )}
    </li>
  );
};

GroupedTransactionContent.displayName = displayName;

export default GroupedTransactionContent;
