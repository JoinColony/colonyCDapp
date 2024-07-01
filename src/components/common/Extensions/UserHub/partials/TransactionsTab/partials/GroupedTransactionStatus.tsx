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

  return (
    <div
      className={clsx('flex max-w-full flex-col items-end', {
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
          'max-w-full',
        )}
        textClassName="flex max-w-full items-center"
      >
        <span className="truncate">{status.toLowerCase()}</span>
        {pending && (
          <SpinnerGap
            className="ml-1 h-[0.8125rem] w-[0.8125rem] flex-shrink-0 animate-spin"
            size={14}
          />
        )}
      </PillsBase>
    </div>
  );
};

GroupedTransactionStatus.displayName = displayName;

export default GroupedTransactionStatus;
