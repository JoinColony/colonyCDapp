import React from 'react';
import {
  flexRender,
  useReactTable,
  getCoreRowModel as libGetCoreRowModel,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { TableProps } from './types';
import { useMobile } from '~hooks';
import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';

const displayName = 'v5.common.Table';

const Table = <T,>({
  className,
  getCoreRowModel,
  getRowClassName = () => undefined,
  verticalOnMobile = true,
  hasPagination = false,
  sizeUnit = 'px',
  ...rest
}: TableProps<T>) => {
  const isMobile = useMobile();
  const table = useReactTable<T>({
    getCoreRowModel: getCoreRowModel || libGetCoreRowModel<T>(),
    ...rest,
  });
  const { rows } = table.getRowModel();
  const headerGroups = table.getHeaderGroups();
  const footerGroups = table.getFooterGroups();
  const hasFooter = footerGroups.map((footerGroup) =>
    footerGroup.headers
      .map((column) => column.column.columnDef)
      .some((columnDef) => columnDef.footer),
  )[0];

  return (
<<<<<<< HEAD
    <div
      className={clsx(
        className,
        'border border-gray-200 rounded-lg overflow-hidden',
      )}
    >
=======
    <>
>>>>>>> 9ac463794 (update structure of table)
      <table
        className={clsx(
          className,
          `
<<<<<<< HEAD
            border-separate
            border-spacing-0
=======
            border-t border-l border-r
            border-separate
            border-spacing-0
            border-1
            w-full
            rounded-t-lg
            border-gray-200
>>>>>>> 9ac463794 (update structure of table)
            overflow-hidden
            table-fixed
            w-full
          `,
        )}
      >
        {isMobile && verticalOnMobile ? (
          rows.map((row) => {
            const cells = row.getVisibleCells();
            const columnsCount = cells.length - 1;

            return (
              <tbody
                key={row.id}
                className={clsx(
                  getRowClassName(row),
                  '[&:not(:last-child)>tr:last-child>th]:border-b [&:not(:last-child)>tr:last-child>td]:border-b',
                )}
              >
                {headerGroups.map((headerGroup) =>
                  headerGroup.headers.map((header, index) => (
<<<<<<< HEAD
                    <tr
                      key={row.id + headerGroup.id + header.id}
                      className="[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100"
                    >
                      <th
                        className={`
                          bg-gray-50
                          p-4
                          text-left
                          text-sm
                          font-normal
                          border-r
                          border-gray-200
                        `}
=======
                    <tr key={row.id + headerGroup.id + header.id}>
                      <th
                        className={`
                            bg-gray-50
                            p-4
                            text-left
                            text-sm
                            font-normal
                            border-r
                            border-gray-200
                          `}
>>>>>>> 9ac463794 (update structure of table)
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                      <td
                        className="p-4 text-left text-sm font-normal"
                        colSpan={columnsCount}
                      >
                        {flexRender(
                          header.column.columnDef.cell,
                          cells[index].getContext(),
                        )}
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            );
          })
        ) : (
          <>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={clsx(
<<<<<<< HEAD
                        'text-left text-sm text-gray-600 bg-gray-50 font-normal px-[1.1rem] empty:p-0 py-[0.7rem] border-b border-b-gray-200',
=======
                        'text-left text-sm text-gray-600 bg-gray-50 font-normal px-[1.1rem] py-[0.7rem]',
>>>>>>> 9ac463794 (update structure of table)
                        {
                          'cursor-pointer': header.column.getCanSort(),
                        },
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        width:
<<<<<<< HEAD
                          header.getSize() !== 150
                            ? `${header.column.getSize()}${sizeUnit}`
=======
                          header.column.getSize() !== 0
                            ? header.column.getSize()
>>>>>>> 9ac463794 (update structure of table)
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.getCanSort() && (
                        <Icon
                          name="arrow-down"
<<<<<<< HEAD
                          appearance={{ size: 'extraTiny' }}
                          className={clsx(
                            'ml-1.5 !w-[0.55rem] !h-[0.55rem] mb-0.5 transition-transform align-middle',
=======
                          className={clsx(
                            'inline-block ml-1 w-3 h-3 transition-transform',
>>>>>>> 9ac463794 (update structure of table)
                            {
                              'rotate-180':
                                header.column.getIsSorted() === 'asc',
                              'rotate-0':
                                header.column.getIsSorted() === 'desc',
                            },
                          )}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="w-full">
              {rows.map((row) => (
<<<<<<< HEAD
                <tr
                  key={row.id}
                  className={clsx(
                    getRowClassName(row),
                    '[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100',
                  )}
                >
=======
                <tr key={row.id} className={getRowClassName(row)}>
>>>>>>> 9ac463794 (update structure of table)
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell?.id}
                      className="text-md text-gray-500 p-[1.1rem]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </>
        )}
        {hasFooter && (
          <tfoot>
            {footerGroups.map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((column) => (
                  <td
                    key={column.id}
                    className="text-md text-gray-500 p-[1.1rem] sm:border-t border-gray-200"
                  >
                    {flexRender(
                      column.column.columnDef.footer,
                      column.getContext(),
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
      {hasPagination && (
<<<<<<< HEAD
        <div className="flex items-center justify-end sm:justify-between pt-2 pb-6 w-full px-[1.125rem]">
          <p className="text-3 text-gray-700 w-full sm:w-auto sm:text-left text-center">
=======
        <div
          className="flex items-center justify-between pt-4 w-full min-w-max px-[1.1rem] pb-8 border-b border-l border-r
        border-1 rounded-b-lg border-gray-200"
        >
          <p className="text-3 text-gray-700">
>>>>>>> 9ac463794 (update structure of table)
            {formatText(
              { id: 'table.pageNumber' },
              {
                actualPage: table.getState().pagination.pageIndex + 1,
                pageNumber: table.getPageCount(),
              },
            )}
          </p>
          <div className="flex items-center gap-2">
            {table.getCanPreviousPage() && (
              <Button
                onClick={() => table.previousPage()}
                size="small"
                mode="primaryOutline"
              >
                {formatText({ id: 'table.previous' })}
              </Button>
            )}
            {table.getCanNextPage() && (
              <Button
                onClick={() => table.nextPage()}
                size="small"
                mode="primaryOutline"
              >
                {formatText({ id: 'table.next' })}
              </Button>
            )}
          </div>
        </div>
      )}
<<<<<<< HEAD
    </div>
=======
    </>
>>>>>>> 9ac463794 (update structure of table)
  );
};

Table.displayName = displayName;

export default Table;
