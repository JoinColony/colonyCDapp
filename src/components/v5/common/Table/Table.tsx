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
import { getDefaultRenderCellWrapper } from './utils';

const displayName = 'v5.common.Table';

const Table = <T,>({
  className,
  getCoreRowModel,
  getRowClassName = () => undefined,
  verticalOnMobile = true,
  hasPagination = false,
  sizeUnit = 'px',
  canNextPage,
  canPreviousPage,
  previousPage,
  nextPage,
  showPageNumber = true,
  showTotalPagesNumber = true,
  paginationDisabled,
  renderCellWrapper = getDefaultRenderCellWrapper<T>(),
  additionalPaginationButtonsContent,
  emptyContent,
  data,
  ...rest
}: TableProps<T>) => {
  const isMobile = useMobile();
  const table = useReactTable<T>({
    getCoreRowModel: getCoreRowModel || libGetCoreRowModel<T>(),
    data,
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
  const goToNextPage = nextPage || table.nextPage;
  const goToPreviousPage = previousPage || table.previousPage;
  const canGoToNextPage =
    canNextPage === undefined ? table.getCanNextPage() : canNextPage;
  const canGoToPreviousPage =
    canPreviousPage === undefined
      ? table.getCanPreviousPage()
      : canPreviousPage;
  const totalColumnsCount = table.getVisibleFlatColumns().length;
  const shouldShowEmptyContent = emptyContent && data.length === 0;

  return (
    <div className={clsx(className, 'border border-gray-200 rounded-lg')}>
      <table
        className={`
          border-separate
          border-spacing-0
          table-fixed
          w-full
        `}
        cellPadding="0"
        cellSpacing="0"
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
                        'text-left text-sm text-gray-600 bg-gray-50 font-normal px-[1.125rem] empty:p-0 py-2.5 border-b border-b-gray-200',
                        {
                          'cursor-pointer':
                            header.column.getCanSort() &&
                            !shouldShowEmptyContent,
                        },
                      )}
                      onClick={
                        shouldShowEmptyContent
                          ? undefined
                          : header.column.getToggleSortingHandler()
                      }
                      style={{
                        width:
                          header.column.columnDef.staticSize ||
                          (header.getSize() !== 150
                            ? `${header.column.getSize()}${sizeUnit}`
                            : undefined),
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
                          appearance={{ size: 'extraTiny' }}
                          className={clsx(
                            'ml-1 mb-0.5 transition-[transform,opacity] align-middle',
                            {
                              'rotate-180':
                                header.column.getIsSorted() === 'asc' &&
                                !shouldShowEmptyContent,
                              'rotate-0':
                                header.column.getIsSorted() === 'desc' &&
                                !shouldShowEmptyContent,
                              'opacity-0':
                                header.column.getIsSorted() === false ||
                                shouldShowEmptyContent,
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
              {shouldShowEmptyContent ? (
                <tr className="[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100">
                  <td colSpan={totalColumnsCount} className="h-[1px]">
                    <div className="text-md text-gray-500 p-[1.1rem] flex h-full flex-col justify-center items-start">
                      {emptyContent}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className={clsx(
                      getRowClassName(row),
                      '[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100',
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const renderCellWrapperCommonArgs = [
                        'text-md text-gray-500 p-[1.1rem] flex h-full flex-col justify-center items-start',
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        ),
                      ] as const;

                      return (
                        <td key={cell?.id} className="h-[1px]">
                          {renderCellWrapper(...renderCellWrapperCommonArgs, {
                            cell,
                            row,
                            renderDefault: () =>
                              getDefaultRenderCellWrapper<T>()(
                                ...renderCellWrapperCommonArgs,
                                { cell, row, renderDefault: () => null },
                              ),
                          })}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
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
                    className="text-md text-gray-500 px-[1.125rem] sm:border-t border-gray-200"
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
      {hasPagination &&
        (showPageNumber || canGoToPreviousPage || canGoToNextPage) && (
          <div
            className={clsx(
              'grid grid-cols-3 gap-2 items-center pt-2 pb-[1.4375rem] px-[1.125rem]',
              {
                'sm:grid-cols-[1fr_auto_auto]':
                  canGoToNextPage ||
                  (additionalPaginationButtonsContent && isMobile),
                'sm:grid-cols-[1fr_auto]': !(
                  canGoToNextPage ||
                  (additionalPaginationButtonsContent && isMobile)
                ),
              },
            )}
          >
            {(canGoToPreviousPage ||
              (additionalPaginationButtonsContent && !isMobile)) && (
              <div className="col-start-1 sm:col-start-2 row-start-1 flex justify-start items-center gap-3">
                {!isMobile && additionalPaginationButtonsContent}
                {canGoToPreviousPage && (
                  <Button
                    onClick={goToPreviousPage}
                    size="small"
                    mode="primaryOutline"
                    disabled={paginationDisabled}
                  >
                    {formatText({ id: 'table.previous' })}
                  </Button>
                )}
              </div>
            )}
            {showPageNumber && (
              <p className="col-start-2 text-3 text-gray-700 w-full sm:w-auto sm:text-left text-center sm:col-start-1 row-start-1">
                {formatText(
                  {
                    id: showTotalPagesNumber
                      ? 'table.pageNumberWithTotal'
                      : 'table.pageNumber',
                  },
                  {
                    actualPage: table.getState().pagination.pageIndex + 1,
                    pageNumber: table.getPageCount(),
                  },
                )}
              </p>
            )}
            {(canGoToNextPage ||
              (additionalPaginationButtonsContent && isMobile)) && (
              <div className="col-start-3 row-start-1 flex justify-end items-center gap-3">
                {isMobile && additionalPaginationButtonsContent}
                {canGoToNextPage && (
                  <Button
                    onClick={goToNextPage}
                    size="small"
                    mode="primaryOutline"
                    disabled={paginationDisabled}
                  >
                    {formatText({ id: 'table.next' })}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
    </div>
  );
};

Table.displayName = displayName;

export default Table;
