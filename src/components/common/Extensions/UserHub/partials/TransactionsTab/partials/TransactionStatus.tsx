import React, { FC } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';

import { TRANSACTION_STATUSES } from '~types';

import Icon from '~shared/Icon';

import { TransactionStatusProps } from '../types';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.TransactionStatus';

const TransactionStatus: FC<TransactionStatusProps> = ({ status, date }) => {
  const ready = status === TRANSACTION_STATUSES.READY;
  const failed = status === TRANSACTION_STATUSES.FAILED;
  const succeeded = status === TRANSACTION_STATUSES.SUCCEEDED;
  const pending = status === TRANSACTION_STATUSES.PENDING;

  const createdAt = date && format(new Date(date ?? 0 * 1000), 'dd MMMM yyyy');

  return (
    <div
      className={clsx('flex flex-col items-end', {
        'text-success-400': succeeded || ready,
        'text-negative-400': failed,
      })}
    >
      {pending ? (
        <Icon
          name="spinner-gap"
          className="ml-[0.59375rem] w-[0.8125rem] h-[0.8125rem] animate-spin text-blue-400"
          appearance={{ size: 'tiny' }}
        />
      ) : (
        <Icon
          name={succeeded || ready ? 'check-circle' : 'x-circle'}
          appearance={{ size: 'tiny' }}
        />
      )}
      {createdAt && (
        <span className="text-gray-400 text-xs block mt-1">{createdAt}</span>
      )}
    </div>
  );
};

TransactionStatus.displayName = displayName;

export default TransactionStatus;
