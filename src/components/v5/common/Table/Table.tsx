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

import { formatText } from '~utils/intl.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';

import TablePagination from './partials/TablePagination/index.ts';
import { TableRow } from './partials/VirtualizedRow/VirtualizedRow.tsx';
import { type TableProps } from './types.ts';
import { getDefaultRenderCellWrapper, makeMenuColumn } from './utils.tsx';

const displayName = 'v5.common.Table';

const Table = <T,>({
  className,
  getCoreRowModel,
  getRowClassName = () => undefined,
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
  withBorder = true,
  isDisabled = false,
  verticalLayout,
  virtualizedProps,
  tableClassName,
  tableBodyRowKeyProp,
  footerColSpan,
  ...rest
}: TableProps<T>) => {
  const helper = useMemo(() => createColumnHelper<T>(), []);

  const columnsWithMenu = useMemo(
    () => [
      ...columns,
      ...(getMenuProps && !verticalLayout
        ? [
            makeMenuColumn<T>({
              helper,
              getMenuProps,
              meatBallMenuSize,
              meatBallMenuStaticSize,
            }),
          ]
        : []),
    ],
    [
      columns,
      getMenuProps,
      verticalLayout,
      helper,
      meatBallMenuSize,
      meatBallMenuStaticSize,
    ],
  );

  const table = useReactTable<T>({
    getCoreRowModel: getCoreRowModel || libGetCoreRowModel<T>(),
    data,
    columns: columnsWithMenu,
    enableSortingRemoval: false,
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
  const pageCount = table.getPageCount();
  const hasPagination = pageCount > 1 || canGoToNextPage || canGoToPreviousPage;
  const totalColumnsCount = table.getVisibleFlatColumns().length;
  const shouldShowEmptyContent = emptyContent && data.length === 0;

  return (
    <div className={className}>
      <table
        className={clsx(
          `
          h-px
          w-full
          table-fixed
          border-separate
          border-spacing-0
          rounded-lg
          border
          border-gray-200
        `,
          tableClassName,
        )}
        cellPadding="0"
        cellSpacing="0"
      >
        {verticalLayout ? (
          rows.map((row) => {
            const cells = row.getVisibleCells();

            return (
              <tbody
                key={row.id}
                className={clsx(
                  getRowClassName(row),
                  '[&:not(:last-child)>tr:last-child>td]:border-b [&:not(:last-child)>tr:last-child>th]:border-b [&_tr:first-child_td]:pt-2 [&_tr:first-child_th]:h-[2.875rem] [&_tr:first-child_th]:pt-2 [&_tr:last-child_td]:pb-2 [&_tr:last-child_th]:h-[2.875rem] [&_tr:last-child_th]:pb-2',
                )}
              >
                {headerGroups.map((headerGroup) =>
                  headerGroup.headers.map((header, index) => {
                    const rowWithMeatBallMenu = index === 0 && !!getMenuProps;
                    const meatBallMenuProps = getMenuProps?.(row);
                    const colSpan =
                      meatBallMenuProps && rowWithMeatBallMenu ? undefined : 2;

                    return (
                      <TableRow
                        key={row.id + headerGroup.id + header.id}
                        itemHeight={virtualizedProps?.virtualizedRowHeight || 0}
                        isEnabled={!!virtualizedProps}
                        className={clsx({
                          '[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100':
                            withBorder,
                        })}
                      >
                        <th
                          className={`
                            h-[2.625rem]
                            border-r
                            border-r-gray-200
                            bg-gray-50
                            px-4
                            py-1
                            text-left
                            text-sm
                            font-normal
                            first:rounded-tl-lg
                            last:rounded-tr-lg
                          `}
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
                        </th>
                        <td
                          className={clsx(
                            'h-full text-left text-sm font-normal',
                            {
                              'py-1 pl-4': !colSpan,
                              'px-4 py-1': colSpan,
                            },
                          )}
                          colSpan={colSpan}
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
                              buttonClassName="ml-auto"
                              contentWrapperClassName={clsx(
                                meatBallMenuProps?.contentWrapperClassName,
                                '!left-6 right-6 !z-[65] sm:!left-auto',
                              )}
                            />
                          </td>
                        )}
                      </TableRow>
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
                        'border-b border-b-gray-200 bg-gray-50 px-[1.125rem] py-2.5 text-left text-sm font-normal text-gray-600 first:rounded-tl-lg last:rounded-tr-lg empty:p-0',
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
                            'mb-0.5 ml-1 inline-block align-middle transition-[transform,opacity]',
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
                    <div className="flex flex-col items-start justify-center px-[1.1rem] py-4 text-md text-gray-500">
                      {emptyContent}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const showExpandableContent =
                    row.getIsExpanded() && renderSubComponent;

                  const rowKey = tableBodyRowKeyProp
                    ? data[row.index]?.[tableBodyRowKeyProp]
                    : null;

                  const key =
                    typeof rowKey === 'string' || typeof rowKey === 'number'
                      ? rowKey
                      : row.id;

                  return (
                    <React.Fragment key={key}>
                      <TableRow
                        itemHeight={virtualizedProps?.virtualizedRowHeight || 0}
                        isEnabled={!!virtualizedProps}
                        className={clsx(getRowClassName(row), {
                          'translate-z-0 relative [&>tr:first-child>td]:pr-9 [&>tr:last-child>td]:p-0 [&>tr:last-child>th]:p-0':
                            getMenuProps,
                          '[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100':
                            (!showExpandableContent && row.getCanExpand()) ||
                            withBorder,
                          'expanded-below': showExpandableContent,
                        })}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const renderCellWrapperCommonArgs = [
                            clsx(
                              'flex h-full flex-col items-start justify-center p-[1.1rem] text-md',
                              {
                                'text-gray-500': !isDisabled,
                                'text-gray-300': isDisabled,
                              },
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
                      </TableRow>
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
                {footerGroup.headers.map((column, index) => {
                  const isLastColumn = index === footerGroup.headers.length - 1;

                  return (
                    <td
                      colSpan={isLastColumn ? footerColSpan : 1}
                      key={column.id}
                      className={clsx(
                        'h-full px-[1.1rem] text-md text-gray-500',
                        {
                          'border-t border-gray-200': !verticalLayout,
                        },
                      )}
                    >
                      {flexRender(
                        column.column.columnDef.footer,
                        column.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
      {hasPagination &&
        showPageNumber &&
        (canGoToPreviousPage || canGoToNextPage) && (
          <TablePagination
            onNextClick={goToNextPage}
            onPrevClick={goToPreviousPage}
            canGoToNextPage={canGoToNextPage}
            canGoToPreviousPage={canGoToPreviousPage}
            pageNumberLabel={formatText(
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
            disabled={paginationDisabled}
          >
            {additionalPaginationButtonsContent}
          </TablePagination>
        )}
    </div>
  );
};

Table.displayName = displayName;

export default Table;
