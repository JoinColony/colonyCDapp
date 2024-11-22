import {
  useReactTable,
  getCoreRowModel as libGetCoreRowModel,
  createColumnHelper,
  getExpandedRowModel,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useEffect, useMemo } from 'react';

import { useMobile } from '~hooks';
import { formatText } from '~utils/intl.ts';

import { TableFooter } from './partials/TableFooter.tsx';
import { TableLayout } from './partials/TableLayout/TableLayout.tsx';
import TablePagination from './partials/TablePagination/index.ts';
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
  withNarrowBorder = false,
  isDisabled = false,
  verticalLayout,
  virtualizedProps,
  tableClassName,
  tableBodyRowKeyProp,
  showTableHead = true,
  showTableBorder = true,
  alwaysShowPagination = false,
  footerColSpan,
  ...rest
}: TableProps<T>) => {
  const helper = useMemo(() => createColumnHelper<T>(), []);
  const isMobile = useMobile();

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
  const showPagination =
    alwaysShowPagination || (hasPagination && showPageNumber);
  const totalColumnsCount = table.getVisibleFlatColumns().length;
  const hasExpandableRows = !!renderSubComponent;

  useEffect(() => {
    if (!isMobile && hasExpandableRows) {
      rows.forEach((row) => {
        if (row.getIsExpanded()) {
          row.toggleExpanded(false);
        }
      });
    }
  }, [isMobile, hasExpandableRows, rows]);

  return (
    <div
      className={clsx(className, {
        'border-separate border-spacing-0 rounded-lg border border-gray-200':
          showTableBorder,
      })}
    >
      <table
        className={clsx('w-full table-fixed', tableClassName)}
        cellPadding="0"
        cellSpacing="0"
      >
        <TableLayout
          verticalLayout={verticalLayout}
          rows={rows}
          headerGroups={headerGroups}
          getRowClassName={getRowClassName}
          getMenuProps={getMenuProps}
          renderSubComponent={renderSubComponent}
          showTableHead={showTableHead}
          emptyContent={emptyContent}
          totalColumnsCount={totalColumnsCount}
          withBorder={withBorder}
          withNarrowBorder={withNarrowBorder}
          virtualizedProps={virtualizedProps}
          sizeUnit={sizeUnit}
          meatBallMenuSize={meatBallMenuSize}
          meatBallMenuStaticSize={meatBallMenuStaticSize}
          renderCellWrapper={renderCellWrapper}
          data={data}
          isDisabled={isDisabled}
          tableBodyRowKeyProp={tableBodyRowKeyProp}
        />
        <TableFooter
          colSpan={footerColSpan}
          verticalLayout={verticalLayout}
          groups={footerGroups}
        />
      </table>
      {showPagination && (
        <TablePagination
          onNextClick={hasPagination ? goToNextPage : () => {}}
          onPrevClick={hasPagination ? goToPreviousPage : () => {}}
          canGoToNextPage={
            hasPagination ? canGoToNextPage : alwaysShowPagination
          }
          canGoToPreviousPage={hasPagination ? canGoToPreviousPage : false}
          pageNumberLabel={formatText(
            {
              id: showTotalPagesNumber
                ? 'table.pageNumberWithTotal'
                : 'table.pageNumber',
            },
            {
              actualPage: hasPagination
                ? table.getState().pagination.pageIndex + 1
                : 1,
              pageNumber: hasPagination ? pageCount : 1,
            },
          )}
          disabled={!hasPagination || paginationDisabled}
        >
          {additionalPaginationButtonsContent}
        </TablePagination>
      )}
    </div>
  );
};

Table.displayName = displayName;

export default Table;
