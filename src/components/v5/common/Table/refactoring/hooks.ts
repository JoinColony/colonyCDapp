import {
  useReactTable,
  getExpandedRowModel,
  getCoreRowModel as libGetCoreRowModel,
} from '@tanstack/react-table';

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
