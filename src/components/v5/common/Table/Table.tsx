import React from 'react';
import {
  flexRender,
  useReactTable,
  getCoreRowModel as libGetCoreRowModel,
} from '@tanstack/react-table';
import { TableProps } from './types';

const displayName = 'v5.common.Table';

const Table = <T,>({
  className,
  title,
  getCoreRowModel,
  ...rest
}: TableProps<T>) => {
  const table = useReactTable<T>({
    getCoreRowModel: getCoreRowModel || libGetCoreRowModel<T>(),
    ...rest,
  });

  return (
    <div className={className}>
      {title && <h5 className="text-2 mb-3">{title}</h5>}
      <table className="border border-separate border-spacing-0 border-1 w-full border-gray-200 rounded-lg">
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
        </tbody>
      </table>
    </div>
  );
};

Table.displayName = displayName;

export default Table;
