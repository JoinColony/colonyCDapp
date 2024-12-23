import {
  useReactTable,
  getExpandedRowModel,
  getCoreRowModel as libGetCoreRowModel,
  type Row,
} from '@tanstack/react-table';
import { useEffect } from 'react';

export const useTable = <T>({ data, columns, rows, overrides }) => {
  const table = useReactTable<T>({
    getCoreRowModel: libGetCoreRowModel<T>(),
    data,
    columns,
    enableSortingRemoval: false,
    getRowCanExpand: rows?.canExpand,
    getExpandedRowModel: getExpandedRowModel<T>(),
    ...overrides,
  });

  return table;
};

export const useCollapseRows = <T>(
  rows: Row<T>[],
  isSomeRowsExpanded: boolean,
) => {
  useEffect(() => {
    if (isSomeRowsExpanded) {
      rows.forEach((row) => {
        if (row.getIsExpanded() && !row.getCanExpand()) {
          row.toggleExpanded(false);
        }
      });
    }
  }, [isSomeRowsExpanded, rows]);
};
