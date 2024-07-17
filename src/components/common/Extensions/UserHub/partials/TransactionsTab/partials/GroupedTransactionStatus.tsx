import { SpinnerGap } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { TransactionStatus as TransactionStatusEnum } from '~gql';
import PillsBase from '~v5/common/Pills/index.ts';

import { type TransactionStatusProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.GroupedTransactionStatus';

const GroupedTransactionStatus: FC<TransactionStatusProps> = ({ status }) => {
  const failed = status === TransactionStatusEnum.Failed;
  const succeeded = status === TransactionStatusEnum.Succeeded;
  const pending = status === TransactionStatusEnum.Pending;

  return (
    <div
      className={clsx('flex min-w-0 flex-col items-end', {
        'text-success-400': succeeded,
        'text-negative-400': failed,
      })}
    >
      <PillsBase
        className={clsx(
          {
            'bg-success-100 text-success-400': succeeded,
            'bg-negative-100 text-negative-400': failed,
            'bg-gray-100 text-gray-500': !succeeded && !failed,
          },
          'min-w-0 max-w-full',
        )}
        textClassName="flex min-w-0 items-center"
      >
        <span className="min-w-0 truncate">{status.toLowerCase()}</span>
        {pending && (
          <SpinnerGap
            className="flex-grow-1 ml-1 inline-block h-[0.8125rem] w-[0.8125rem] flex-shrink-0 animate-spin text-blue-400"
            size={14}
          />
        )}
      </PillsBase>
    </div>
  );
};

GroupedTransactionStatus.displayName = displayName;

export default GroupedTransactionStatus;
