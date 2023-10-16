import React, { useCallback, useMemo } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
import { BalanceTableModel } from './types';
import { formatText } from '~utils/intl';
import TokenTypeBadge from '~v5/common/Pills/TokenTypeBadge/TokenTypeBadge';
import Numeral from '~shared/Numeral';
import EthUsd from '~shared/EthUsd';

export const useBalanceTableColumns = (): ColumnDef<
  BalanceTableModel,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<BalanceTableModel>(),
    [],
  );

  const columns: ColumnDef<BalanceTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'asset',
        header: () => formatText({ id: 'table.row.asset' }),
        cell: ({ row }) => <div>{row.original.asset}</div>,
      }),
      columnHelper.display({
        id: 'symbol',
        header: () => formatText({ id: 'table.row.symbol' }),
        cell: ({ row }) => <div>{row.original.symbol}</div>,
      }),
      columnHelper.display({
        id: 'type',
        header: () => formatText({ id: 'table.row.type' }),
        cell: ({ row }) => (
          <TokenTypeBadge
            tokenType={row.original.type}
            name={
              (row.original.type === 'CHAIN_NATIVE' && 'Native') ||
              (row.original.type === 'COLONY' && 'Reputation') ||
              ''
            }
          />
        ),
      }),
      columnHelper.display({
        id: 'balance',
        header: () => formatText({ id: 'table.row.balance' }),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <Numeral
              value={row.original.balance}
              suffix={row.original.symbol}
              decimals={row.original.decimals}
              className="text-1 text-gray-900"
            />
            {row.original.balance !== '0' && (
              <EthUsd
                value={row.original.balance}
                showPrefix
                className="text-gray-600 text-sm"
              />
            )}
          </div>
        ),
      }),
    ],
    [columnHelper],
  );

  return columns;
};

export const useGetTableMenuProps = () =>
  useCallback<TableWithMeatballMenuProps<BalanceTableModel>['getMenuProps']>(
    () => ({
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      items: [
        {
          key: 'add_funds',
          onClick: () => {},
          label: 'Add funds',
          iconName: 'add',
        },
        {
          key: 'view_ethscan',
          onClick: () => {},
          label: 'View on Ethscan',
          iconName: 'arrow-square-out',
        },
        {
          key: 'mint_tokens',
          onClick: () => {},
          label: 'Mint tokens',
          iconName: 'bank',
        },
        {
          key: 'transfer_fundss',
          onClick: () => {},
          label: 'Transfer funds',
          iconName: 'transfer',
        },
        {
          key: 'make_payment',
          onClick: () => {},
          label: 'Make payment using this token',
          iconName: 'hand-coins',
        },
      ],
    }),
    [],
  );
