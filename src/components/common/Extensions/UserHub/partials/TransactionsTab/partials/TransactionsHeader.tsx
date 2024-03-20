import { CheckCircle, XCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { TransactionStatus } from '~gql';

import { type TransactionHeaderProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.TransactionsTab.partials.TransactionHeader';

const TransactionsHeader: FC<TransactionHeaderProps> = ({
  title,
  description,
  date,
  status,
}) => {
  const ready = status === TransactionStatus.Ready;
  const failed = status === TransactionStatus.Failed;
  const succeeded = status === TransactionStatus.Succeeded;

  return (
    <>
      <div>
        <h4 className="text-1">{title}</h4>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
      <div
        className={clsx('flex flex-col items-end', {
          'text-success-400': succeeded || ready,
          'text-negative-400': failed,
        })}
      >
        {succeeded || ready ? <CheckCircle size={14} /> : <XCircle size={14} />}
        <span className="mt-1 block text-xs text-gray-400">{date}</span>
      </div>
    </>
  );
};

TransactionsHeader.displayName = displayName;

export default TransactionsHeader;
