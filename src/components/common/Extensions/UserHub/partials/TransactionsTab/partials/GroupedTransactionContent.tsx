import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

import { type GroupedTransactionContentProps } from '../types.ts';

import CancelTransaction from './CancelTransaction.tsx';
import { useGroupedTransactionContent } from './hooks.tsx';
import TransactionStatus from './TransactionStatus.tsx';
import { shortErrorMessage } from './utils.ts';

const displayName =
  'common.Extensions.UserHub.partials.TransactionsTab.partials.GroupedTransactionContent';

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
  isCancelable = true,
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
    title,
    titleValues,
  },
}) => {
  const titleId = ['transaction', context, methodName, methodContext, 'title']
    .filter((i) => !!i)
    .join('.');

  const titleMsg = title || { id: titleId };

  const titleText = formatText(
    titleMsg,
    (titleValues || params) as Record<string, any>,
  );

  const {
    failed,
    pending,
    succeeded,
    isShowingCancelConfirmation,
    toggleCancelConfirmation,
    handleCancelTransaction,
  } = useGroupedTransactionContent({
    id,
    status,
    selected,
  });

  return (
    <li
      className={clsx(
        `relative rounded bg-gray-50 px-3.5 py-[0.4375rem] text-sm 
      before:absolute before:left-0 before:top-[0.4375rem] 
      before:block before:h-[1rem] before:w-0.5 before:content-[""] 
      first:pt-3 first:before:top-3 last:pb-3`,
        {
          'before:bg-success-400': succeeded,
          'before:bg-negative-400': failed,
          'before:bg-blue-400': pending,
          'font-semibold': selected,
        },
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-gray-900">
          {`${(group?.index || idx) + 1}. `} {titleText}
        </div>

        <TransactionStatus status={status} hasError={!!error} />
      </div>
      {failed && error && (
        <div className="mt-2 md:mr-2">
          <NotificationBanner
            status="error"
            callToActionClassName="w-full no-underline"
            contentClassName="@[600px]/notificationBanner:flex-col"
            callToAction={
              <div className="flex justify-end">
                {isCancelable && (
                  <CancelTransaction
                    isShowingCancelConfirmation={isShowingCancelConfirmation}
                    handleCancelTransaction={handleCancelTransaction}
                    toggleCancelConfirmation={toggleCancelConfirmation}
                  />
                )}
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
