import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { TransactionsProps } from './types';
import TransactionsItem from './partials/TransactionsItem';

export const displayName = 'common.Extensions.UserHub.partials.TransactionsTab';

const TransactionsTab: FC<TransactionsProps> = ({ items, openIndex, onOpenIndexChange }) => {
  const { formatMessage } = useIntl();

  const onClick = (index: number) => {
    if (!onOpenIndexChange) return;

    if (index === openIndex) {
      onOpenIndexChange(undefined);

      return;
    }

    onOpenIndexChange(index);
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <div className="font-semibold text-lg text-gray-900">{formatMessage({ id: 'transactions' })}</div>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={item.key} className="border-b border-gray-100 py-3.5 last:border-none first:pt-0 last:pb-0">
            <TransactionsItem {...item} isOpen={openIndex === index} onClick={() => onClick(index)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

TransactionsTab.displayName = displayName;

export default TransactionsTab;
