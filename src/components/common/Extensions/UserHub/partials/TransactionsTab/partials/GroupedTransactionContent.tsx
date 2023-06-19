import React, { FC } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import styles from './TransactionsItem/TransactionsItem.module.css';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import { GroupedTransactionContentProps } from '../types';
import { useGroupedTransactionContent } from './hooks';

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
  const { formatMessage } = useIntl();

  const {
    defaultTransactionMessageDescriptorId,
    handleRetryAction,
    failed,
    ready,
    pending,
    succeeded,
  } = useGroupedTransactionContent(
    id,
    error,
    methodContext,
    methodName,
    metatransaction,
    context,
    status,
  );

  return (
    <li
      className={clsx(`${styles.listItem}`, {
        'before:bg-success-400': ready || succeeded,
        'before:bg-negative-400': failed,
        'before:bg-blue-400': pending,
        'font-bold': selected,
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
              'text-success-400': ready || succeeded,
              'text-negative-400': failed,
            })}
          >
            <Icon
              name={ready || succeeded ? 'check-circle' : 'warning-circle'}
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
