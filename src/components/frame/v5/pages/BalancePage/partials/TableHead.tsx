import React, { FC } from 'react';
import clsx from 'clsx';
import Icon from '~shared/Icon';
import { TableHeadProps } from '../types';
import { formatText } from '~utils/intl';

const displayName = 'v5.pages.BalancePage.partials.TableHead';

const TableHead: FC<TableHeadProps> = ({ onClick, isSorted }) => {
  return (
    <div
      className={`py-3 px-4 bg-base-bg border-l border-r border-gray-200 grid
      grid-cols-[1fr_0.5fr_0.5fr_0.5fr] sm:grid-cols-[2fr_0.5fr_0.5fr_1fr_1fr] text-sm text-gray-600`}
    >
      <div>{formatText({ id: 'table.row.asset' })}</div>
      <div>{formatText({ id: 'table.row.symbol' })}</div>
      <div className="hidden sm:flex">
        {formatText({ id: 'table.row.type' })}
      </div>
      <button
        className="w-auto flex gap-1 items-center ml-auto"
        type="button"
        aria-label={formatText({ id: 'ariaLabel.sortBalace' })}
        onClick={onClick}
      >
        <span>{formatText({ id: 'table.row.balance' })}</span>
        <Icon
          name="arrow-down"
          appearance={{ size: 'extraTiny' }}
          className={clsx('w-3 h-3 transition-transform', {
            'rotate-180': !isSorted,
            'rotate-0': isSorted,
          })}
        />
      </button>
      <div />
    </div>
  );
};

TableHead.displayName = displayName;

export default TableHead;
