import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';

import TokenSelect from '../TokenSelect/index.ts';
import TokenSymbol from '../TokenSelect/partials/TokenSymbol/index.ts';

import { type TokensTableModel } from './types.ts';

export const useTokensTableColumns = (
  name: string,
  data,
): ColumnDef<TokensTableModel, string>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<TokensTableModel>(),
    [],
  );
  const dataRef = useWrapWithRef(data);

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const columns: ColumnDef<TokensTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'token',
        header: () => formatText({ id: 'table.row.token' }),
        cell: ({ row }) => (
          <TokenSelect
            name={`${name}.${row.index}.token`}
            disabled={hasNoDecisionMethods}
          />
        ),
      }),
      columnHelper.display({
        id: 'symbol',
        header: () => formatText({ id: 'table.row.symbol' }),
        cell: ({ row }) => (
          <TokenSymbol
            address={dataRef.current?.[row.index]?.token}
            disabled={hasNoDecisionMethods}
          />
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnHelper, name],
  );

  return columns;
};
