import React from 'react';

import { useTable } from './hooks.ts';
import { BaseTable } from './partials/BaseTable.tsx';
import { type BaseTableProps } from './types.ts';

export const UnpaginatedTable = <T,>(
  props: Omit<BaseTableProps<T>, 'table'>,
) => {
  const { data, columns, rows, overrides = {} } = props;

  const table = useTable<T>({
    data,
    overrides,
    columns,
    rows,
  });

  return <BaseTable {...props} table={table} />;
};
