import { SpinnerGap, CheckCircle, XCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { type FC } from 'react';

import { TransactionStatus as TransactionStatusEnum } from '~gql';

import { type TransactionStatusProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.TransactionStatus';

const TransactionStatus: FC<TransactionStatusProps> = ({ status, date }) => {
  const failed = status === TransactionStatusEnum.Failed;
  const succeeded = status === TransactionStatusEnum.Succeeded;
  const pending = status === TransactionStatusEnum.Pending;

  const createdAt = date && format(new Date(date ?? 0 * 1000), 'dd MMMM yyyy');

  return (
    <div
      className={clsx('flex flex-col items-end', {
        'text-success-400': succeeded,
        'text-negative-400': failed,
      })}
    >
      {pending && (
        <SpinnerGap
          className="ml-2.5 w-[0.8125rem] h-[0.8125rem] animate-spin text-blue-400"
          size={14}
        />
      )}
      {succeeded && <CheckCircle size={14} />}
      {failed && <XCircle size={14} />}
      {createdAt && (
        <span className="text-gray-400 text-xs block mt-1">{createdAt}</span>
      )}
    </div>
  );
};

TransactionStatus.displayName = displayName;

export default TransactionStatus;
