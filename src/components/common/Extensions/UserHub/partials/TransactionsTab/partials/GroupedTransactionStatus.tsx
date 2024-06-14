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
      className={clsx('flex flex-col items-end', {
        'text-success-400': succeeded,
        'text-negative-400': failed,
      })}
    >
      {pending && (
        <SpinnerGap
          className="absolute right-[-20px] top-[0.125rem] ml-2.5 h-[0.8125rem] w-[0.8125rem] animate-spin text-blue-400"
          size={14}
        />
      )}
      <PillsBase
        className={clsx({
          'bg-success-100 text-success-400': succeeded,
          'bg-negative-100 text-negative-400': failed,
          'bg-gray-100 text-gray-500': !succeeded && !failed,
        })}
      >
        {status.toLowerCase()}
      </PillsBase>
    </div>
  );
};

GroupedTransactionStatus.displayName = displayName;

export default GroupedTransactionStatus;
