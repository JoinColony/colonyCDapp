import React from 'react';
import { useIntl } from 'react-intl';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TableProps } from './types';
import clsx from 'clsx';

const displayName = 'v5.common.Table';

const Table = <T,>({ className, tableTitle, data, columns }: TableProps<T>) => {
  const { formatMessage } = useIntl();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={className}>
      {tableTitle && (
        <h5 className="text-2 mb-3">{formatMessage(tableTitle)}</h5>
      )}
      <div className="border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="h-[2.1875rem] bg-gray-50 rounded-t-lg border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="w-1/3 text-left text-sm text-gray-600 font-normal rounded-t-lg px-4"
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
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const lastRow =
                table.getRowModel().rows[table.getRowModel().rows?.length - 1];
              return (
                <tr
                  key={row.id}
                  className={clsx('h-[3.125rem]', {
                    'border-b border-b-gray-200': lastRow.id !== row.id,
                  })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 text-md text-gray-500">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.displayName = displayName;

export default Table;
