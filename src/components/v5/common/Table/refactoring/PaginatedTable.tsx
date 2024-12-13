import React from 'react';

import { formatText } from '~utils/intl.ts';
import noop from '~utils/noop.ts';

import TablePagination from '../partials/TablePagination/TablePagination.tsx';

import { useTable } from './hooks.ts';
import { BaseTable } from './partials/BaseTable.tsx';
import { type PaginatedTableProps } from './types.ts';

export const PaginatedTable = <T,>(props: PaginatedTableProps<T>) => {
  const {
    pagination: {
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      visible,
      disabled,
      pageNumberVisible = true,
      pageTotalVisible = true,
      children,
    } = {
      pageNumberVisible: true,
      pageTotalVisible: true,
    },
    ...rest
  } = props;
  const { data, rows, columns, overrides = {} } = rest;

  const table = useTable<T>({
    data,
    rows,
    overrides,
    columns,
  });

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
  const showPagination = visible || (hasPagination && pageNumberVisible);

  return (
    <BaseTable {...rest} table={table}>
      {showPagination ? (
        <TablePagination
          onNextClick={hasPagination ? goToNextPage : noop}
          onPrevClick={hasPagination ? goToPreviousPage : noop}
          canGoToNextPage={hasPagination ? canGoToNextPage : visible}
          canGoToPreviousPage={hasPagination ? canGoToPreviousPage : false}
          pageNumberLabel={formatText(
            {
              id: `table.${pageTotalVisible ? 'pageNumberWithTotal' : 'pageNumber'}`,
            },
            {
              actualPage: hasPagination
                ? table.getState().pagination.pageIndex + 1
                : 1,
              pageNumber: hasPagination ? pageCount : 1,
            },
          )}
          disabled={!hasPagination || disabled}
        >
          {children}
        </TablePagination>
      ) : null}
    </BaseTable>
  );
};
