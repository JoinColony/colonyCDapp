import React, { useMemo, useState } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import TokenTable from '../TokenTable';
import { FundsTableModel } from './types';
import { useColonyContext } from '~hooks';
import getTokenList from '~common/Dialogs/TokenManagementDialog/TokenManagementDialogForm/getTokenList';
import { notNull } from '~utils/arrays';
import { FilterProps, FilterValue } from '../Filter/types';

export const useFundsTableColumns = (): ColumnDef<
  FundsTableModel,
  string
>[] => {
  const columnHelper = useMemo(() => createColumnHelper<FundsTableModel>(), []);

  const columns: ColumnDef<FundsTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'token',
        cell: ({ row }) => <TokenTable token={row.original.token} />,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnHelper],
  );

  return columns;
};

export const useFundsTable = () => {
  const [value, setValue] = useState<FilterValue>({
    tokenType: {
      approved: true,
    },
  });

  const onChange = (filterValue) => {
    setValue(filterValue);
  };

  const { colony } = useColonyContext();
  const predefinedTokens = getTokenList();
  const colonyTokens = useMemo(
    () => colony?.tokens?.items.filter(notNull) || [],
    [colony?.tokens?.items],
  );

  const allTokens = [...colonyTokens, ...predefinedTokens].map((token) => ({
    ...token,
    isApproved: colonyTokens.some(
      ({ token: colonyToken }) =>
        colonyToken.tokenAddress === token.token.tokenAddress,
    ),
  }));

  const visibleTokens = allTokens.filter((visibleToken) => {
    const { tokenType } = value;

    return (
      ((!tokenType || tokenType.approved) && visibleToken.isApproved) ||
      (tokenType && tokenType.unapproved && !visibleToken.isApproved)
    );
  });

  const filters: FilterProps = {
    onChange,
    value,
    items: [
      {
        key: 'tokenType',
        label: 'Token type',
        iconName: 'coin-vertical',
        items: [
          {
            key: 'approved',
            label: 'Approved',
          },
          {
            key: 'unapproved',
            label: 'Unapproved',
          },
        ],
      },
      {
        key: 'tokenStatus',
        label: 'Token status',
        iconName: 'shield-check',
        items: [
          {
            key: 'test1',
            label: 'test1',
          },
          {
            key: 'test2',
            label: 'test2',
            items: [
              {
                key: 'nestedTest1',
                label: 'nested test1',
              },
              {
                key: 'nestedTest2',
                label: 'nested test2',
              },
            ],
          },
        ],
      },
    ],
  };

  return {
    filters,
    visibleTokens,
  };
};
