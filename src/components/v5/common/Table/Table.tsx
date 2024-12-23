import React from 'react';

import { formatText } from '~utils/intl.ts';

import { useTable } from './hooks.ts';
import { BaseTable } from './partials/BaseTable.tsx';
import TablePagination from './partials/TablePagination/TablePagination.tsx';
import { type TableProps } from './types.ts';
import { getPaginationConfig } from './utils.tsx';

export const Table = <T,>(props: TableProps<T>) => {
  const { pagination = {}, ...rest } = props;
  const { pageTotalVisible = true, children } = pagination;
  const { data, rows, columns, overrides = {} } = rest;

  const table = useTable<T>({
    data,
    rows,
    overrides,
    columns,
  });

  const {
    disabled,
    showPagination,
    actualPage,
    pageNumber,
    goToNextPage,
    goToPreviousPage,
    canGoToNextPage,
    canGoToPreviousPage,
  } = getPaginationConfig(table, pagination);

  return (
    <BaseTable {...rest} table={table}>
      {showPagination ? (
        <TablePagination
          onNextClick={goToNextPage}
          onPrevClick={goToPreviousPage}
          canGoToNextPage={canGoToNextPage}
          canGoToPreviousPage={canGoToPreviousPage}
          pageNumberLabel={formatText(
            {
              id: `table.${pageTotalVisible ? 'pageNumberWithTotal' : 'pageNumber'}`,
            },
            {
              actualPage,
              pageNumber,
            },
          )}
          disabled={disabled}
        >
          {children}
        </TablePagination>
      ) : null}
    </BaseTable>
  );
};
