import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { TableProps } from './types';
import { useMobile } from '~hooks';

const displayName = 'v5.common.Table';

const Table = <T,>({
  className,
  tableTitle,
  columns,
  fields,
  burgerColumn,
  setSelectedRowId,
}: TableProps<T>) => {
  const isMobile = useMobile();

  const table = useReactTable<T>({
    data: fields,
    columns: burgerColumn ? [...columns, ...burgerColumn] : columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const HeaderMobileTable = ({ headerGroups, lastColumn }) =>
    headerGroups.map((headerGroup) => (
      <div
        key={headerGroup.id}
        className={`flex flex-col bg-gray-50 rounded-t-lg border-gray-200 
      capitalize text-gray-600 gap-[1.3rem] py-2 text-sm w-[7.5rem] border-r`}
      >
        {headerGroup.headers.map((header) => (
          <div
            key={header.id}
            className={clsx(
              'text-left text-sm text-gray-600 font-normal rounded-t-lg px-4',
              { hidden: lastColumn.column.id === header.id },
            )}
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </div>
        ))}
      </div>
    ));

  return (
    <div className={className}>
      {tableTitle && <h5 className="text-2 mb-3">{tableTitle}</h5>}
      <div className="border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead
            className={clsx(
              'h-[2.1875rem] bg-gray-50 rounded-t-lg border-b border-gray-200',
              { hidden: isMobile },
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left text-sm text-gray-600 font-normal rounded-t-lg px-4"
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
            {table.getRowModel().rows.map((row) => {
              const lastRow =
                table.getRowModel().rows[table.getRowModel().rows.length - 1];
              const lastColumn =
                row.getVisibleCells()[row.getVisibleCells().length - 1];

              return (
                <tr
                  key={row.id}
                  className={clsx('relative', {
                    'border-b border-b-gray-200': lastRow.id !== row.id,
                    'w-full inline-flex': isMobile,
                    'h-[3.125rem] border-none': !isMobile,
                  })}
                  onClick={() => setSelectedRowId(row.id)}
                >
                  {isMobile && (
                    <HeaderMobileTable
                      headerGroups={table.getHeaderGroups()}
                      lastColumn={lastColumn}
                    />
                  )}

                  <div
                    className={clsx('inline-grid w-full relative', {
                      'contents align-middle': !isMobile,
                    })}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell?.id}
                        className={clsx('text-md text-gray-500', {
                          'px-4 py-2 inline-flex':
                            isMobile &&
                            lastColumn?.column?.id !== cell?.column?.id,
                          'px-4 py-2 h-[3.125rem]': !isMobile,
                          'static top-5 right-0 p-0':
                            isMobile &&
                            lastColumn?.column?.id === cell?.column?.id,
                        })}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </div>
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
