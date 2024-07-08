import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { useTablet } from '~hooks';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { formatText } from '~utils/intl.ts';

import TokenCell from '../TokenCell/TokenCell.tsx';

import { type TokensTableModel } from './types.ts';

export const useTokensTableColumns = (
  data,
): ColumnDef<TokensTableModel, string>[] => {
  const isTablet = useTablet();
  const columnHelper = useMemo(
    () => createColumnHelper<TokensTableModel>(),
    [],
  );
  const dataRef = useWrapWithRef(data);

  const columns: ColumnDef<TokensTableModel, string>[] = useMemo(
    () => [
      columnHelper.accessor('tokenAddress', {
        staticSize: isTablet ? '7.375rem' : undefined,
        header: () => formatText({ id: 'table.row.token' }),
        cell: ({ row, getValue }) => {
          const tokenAddress = getValue();

          return (
            <TokenCell
              tokenAddress={tokenAddress}
              status={dataRef.current?.[row.index]?.status}
            />
          );
        },
      }),
      columnHelper.accessor('status', {
        header: () => formatText({ id: 'table.row.symbol' }),
        cell: ({ row, getValue }) => {
          const status = getValue();

          return dataRef.current?.[row.index]?.tokenAddress ? (
            <TokenCell
              isSymbolCell
              tokenAddress={dataRef.current?.[row.index].tokenAddress}
              status={status}
            />
          ) : null;
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnHelper],
  );

  return columns;
};
