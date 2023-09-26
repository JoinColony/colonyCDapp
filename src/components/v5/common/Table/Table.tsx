import React from 'react';
import {
  flexRender,
  useReactTable,
  getCoreRowModel as libGetCoreRowModel,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { TableProps } from './types';

const displayName = 'v5.common.Table';

const Table = <T,>({ className, getCoreRowModel, ...rest }: TableProps<T>) => {
  const table = useReactTable<T>({
    getCoreRowModel: getCoreRowModel || libGetCoreRowModel<T>(),
    ...rest,
  });

  return (
    <table
      className={clsx(
        className,
        'border border-separate border-spacing-0 border-1 w-full rounded-lg border-gray-200 overflow-hidden',
      )}
    >
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={`text-left text-sm text-gray-600 bg-gray-50 font-normal
                px-[1.1rem] py-[0.7rem]`}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="w-full">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell?.id} className="text-md text-gray-500 p-[1.1rem]">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((column) => (
              <td
                key={column.id}
                className="text-md text-gray-500 p-[1.1rem] border-t border-gray-200"
              >
                {flexRender(
                  column.column.columnDef.footer,
                  column.getContext(),
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.displayName = displayName;

export default Table;
