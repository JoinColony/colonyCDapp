import { ArrowDown } from '@phosphor-icons/react';
import {
  flexRender,
  useReactTable,
  getCoreRowModel as libGetCoreRowModel,
  createColumnHelper,
  getExpandedRowModel,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';

import { type TableProps } from './types.ts';
import { getDefaultRenderCellWrapper, makeMenuColumn } from './utils.tsx';

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
  getMenuProps,
  meatBallMenuSize = 60,
  meatBallMenuStaticSize,
  columns,
  renderSubComponent,
  getRowCanExpand,
  ...rest
}: TableProps<T>) => {
  const isMobile = useMobile();
  const helper = useMemo(() => createColumnHelper<T>(), []);

  const columnsWithMenu = useMemo(
    () => [
      ...columns,
      ...(getMenuProps && !(isMobile && verticalOnMobile)
        ? [
            makeMenuColumn<T>(
              helper,
              getMenuProps,
              meatBallMenuSize,
              meatBallMenuStaticSize,
            ),
          ]
        : []),
    ],
    [
      columns,
      getMenuProps,
      isMobile,
      verticalOnMobile,
      helper,
      meatBallMenuSize,
      meatBallMenuStaticSize,
    ],
  );

  const table = useReactTable<T>({
    getCoreRowModel: getCoreRowModel || libGetCoreRowModel<T>(),
    data,
    columns: columnsWithMenu,
    getRowCanExpand,
    getExpandedRowModel: getExpandedRowModel<T>(),
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
    <div
      className={clsx(
        className,
        'border border-gray-200 rounded-lg overflow-hidden',
      )}
    >
      <table
        className={`
          border-separate
          border-spacing-0
          table-fixed
          w-full
          h-px
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
                  headerGroup.headers.map((header, index) => {
                    const rowWithMeatBallMenu = index === 0 && getMenuProps;
                    const meatBallMenuProps = getMenuProps?.(row);

                    return (
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
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                        <td
                          className={clsx(
                            'text-left text-sm font-normal h-full',
                            {
                              'py-4 pl-4': rowWithMeatBallMenu,
                              'p-4': !rowWithMeatBallMenu,
                            },
                          )}
                          colSpan={
                            rowWithMeatBallMenu
                              ? columnsCount - 1
                              : columnsCount
                          }
                        >
                          {flexRender(
                            header.column.columnDef.cell,
                            cells[index].getContext(),
                          )}
                        </td>
                        {rowWithMeatBallMenu && meatBallMenuProps && (
                          <td
                            className="px-4"
                            style={
                              meatBallMenuSize || meatBallMenuStaticSize
                                ? {
                                    width: `${
                                      meatBallMenuSize || meatBallMenuStaticSize
                                    }${sizeUnit}`,
                                  }
                                : undefined
                            }
                          >
                            <MeatBallMenu
                              {...meatBallMenuProps}
                              contentWrapperClassName={clsx(
                                meatBallMenuProps?.contentWrapperClassName,
                                '!z-[65] !left-6 right-6',
                              )}
                            />
                          </td>
                        )}
                      </tr>
                    );
                  }),
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
                        header.column.columnDef.headCellClassName,
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
                      {header.column.getCanSort() ? (
                        <ArrowDown
                          size={12}
                          className={clsx(
                            'inline-block ml-1 mb-0.5 transition-[transform,opacity] align-middle',
                            {
                              'rotate-180':
                                header.column.getIsSorted() === 'asc' &&
                                !shouldShowEmptyContent,
                              'rotate-0':
                                header.column.getIsSorted() === 'desc' &&
                                !shouldShowEmptyContent,
                              hidden:
                                header.column.getIsSorted() === false ||
                                shouldShowEmptyContent,
                            },
                          )}
                        />
                      ) : null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="w-full">
              {shouldShowEmptyContent ? (
                <tr className="[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100">
                  <td colSpan={totalColumnsCount} className="h-full">
                    <div className="text-md text-gray-500 p-[1.1rem] flex h-full flex-col justify-center items-start">
                      {emptyContent}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const showExpandableContent =
                    row.getIsExpanded() && renderSubComponent;

                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        className={clsx(getRowClassName(row), {
                          'relative translate-z-0 [&>tr:last-child>th]:p-0 [&>tr:last-child>td]:p-0 [&>tr:first-child>td]:pr-9':
                            getMenuProps,
                          '[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100':
                            !showExpandableContent,
                          'expanded-below': showExpandableContent,
                        })}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const renderCellWrapperCommonArgs = [
                            clsx(
                              'text-md text-gray-500 p-[1.1rem] flex h-full flex-col justify-center items-start',
                              cell.column.columnDef.cellContentWrapperClassName,
                            ),
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            ),
                          ] as const;

                          const colSpan =
                            typeof cell.column.columnDef.colSpan === 'number'
                              ? cell.column.columnDef.colSpan
                              : cell.column.columnDef.colSpan?.(
                                  row.getIsExpanded(),
                                );

                          const hideCell = colSpan === 0;

                          return (
                            <td
                              key={cell?.id}
                              className={clsx('h-full', {
                                hidden: hideCell,
                              })}
                              colSpan={colSpan}
                            >
                              {renderCellWrapper(
                                ...renderCellWrapperCommonArgs,
                                {
                                  cell,
                                  row,
                                  renderDefault: () =>
                                    getDefaultRenderCellWrapper<T>()(
                                      ...renderCellWrapperCommonArgs,
                                      { cell, row, renderDefault: () => null },
                                    ),
                                },
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      {showExpandableContent && (
                        <tr className="[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100">
                          <td colSpan={row.getVisibleCells().length}>
                            {renderSubComponent({ row })}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
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
                    className="text-md text-gray-500 px-[1.1rem] sm:border-t border-gray-200 h-full"
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
        showPageNumber &&
        (canGoToPreviousPage || canGoToNextPage) && (
          <div
            className={clsx(
              'grid grid-cols-[1fr_auto_1fr] gap-2 items-center pt-2 pb-[1.4375rem] px-[1.125rem]',
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
