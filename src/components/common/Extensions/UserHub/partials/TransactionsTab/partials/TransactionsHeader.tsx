import React, { FC } from 'react';
import clsx from 'clsx';

import Icon from '~shared/Extensions/Icon';
import { TransactionHeaderProps } from '../types';
import { TRANSACTION_STATUSES } from '~types';

export const displayName = 'common.Extensions.UserHub.TransactionsTab.partials.TransactionHeader';

const TransactionsHeader: FC<TransactionHeaderProps> = ({ title, description, date, status }) => {
  const ready = status === TRANSACTION_STATUSES.READY;
  const failed = status === TRANSACTION_STATUSES.FAILED;
  const succeeded = status === TRANSACTION_STATUSES.SUCCEEDED;

  return (
    <>
      <div>
        <h4 className="font-medium text-md text-gray-900">{title}</h4>
        <p className="text-gray-600 text-xs">{description}</p>
      </div>
      <div
        className={clsx('flex flex-col items-end', {
          'text-success-400': succeeded || ready,
          'text-negative-400': failed,
        })}
      >
        <Icon name={succeeded || ready ? 'check-circle' : 'x-circle'} appearance={{ size: 'tiny' }} />
        <span className="text-gray-400 text-xs block mt-1">{date}</span>
      </div>
    </>
  );
};

TransactionsHeader.displayName = displayName;

export default TransactionsHeader;
