import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';

import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { formatText } from '~utils/intl.ts';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types.ts';

import TokenSelect from '../TokenSelect/index.ts';
import TokenSymbol from '../TokenSelect/partials/TokenSymbol/index.ts';

import { TokensTableModel, TokensTableProps } from './types.ts';

export const useTokensTableColumns = (
  name: string,
  data,
): ColumnDef<TokensTableModel, string>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<TokensTableModel>(),
    [],
  );
  const dataRef = useWrapWithRef(data);

  const columns: ColumnDef<TokensTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'token',
        header: () => formatText({ id: 'table.row.token' }),
        cell: ({ row }) => <TokenSelect name={`${name}.${row.index}.token`} />,
      }),
      columnHelper.display({
        id: 'symbol',
        header: () => formatText({ id: 'table.row.symbol' }),
        cell: ({ row }) => (
          <TokenSymbol address={dataRef.current?.[row.index]?.token} />
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnHelper, name],
  );

  return columns;
};

export const useGetTableMenuProps = (
  { remove },
  data,
  shouldShowMenu: Exclude<TokensTableProps['shouldShowMenu'], undefined>,
) => {
  return useCallback<
    TableWithMeatballMenuProps<TokensTableModel>['getMenuProps']
  >(
    ({ index }) => {
      const shouldShow = shouldShowMenu(data[index]?.token);

      return shouldShow
        ? {
            cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
            items: [
              {
                key: 'remove',
                onClick: () => remove(index),
                label: formatText({ id: 'table.row.remove' }),
                icon: 'trash',
              },
            ],
          }
        : undefined;
    },
    [remove, data, shouldShowMenu],
  );
};
