import {
  SpinnerGap,
  CheckCircle,
  XCircle,
  WarningCircle,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { TransactionStatus as TransactionStatusEnum } from '~gql';

import { type TransactionStatusProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.TransactionStatus';

const TransactionStatus: FC<TransactionStatusProps> = ({
  status,
  hasError,
}) => {
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
        className="absolute right-[-20px] top-[0.125rem] h-[0.8125rem] w-[0.8125rem] animate-spin text-blue-400"
        size={14}
      />
      )}
      {succeeded && <CheckCircle size={14} />}
      {failed && (
        <>{hasError ? <WarningCircle size={14} /> : <XCircle size={14} />}</>
      )}
    </div>
  );
};

TransactionStatus.displayName = displayName;

export default TransactionStatus;
