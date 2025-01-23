import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

import { TableRow } from '~v5/common/Table/partials/VirtualizedRow/VirtualizedRow.tsx';
import { type VerticalTableLayoutProps } from '~v5/common/Table/types.ts';

export const VerticalTableLayout = <T,>({
  rows: rowsConfig,
  borders,
  moreActions,
  table,
}: VerticalTableLayoutProps<T>) => {
  const { rows } = table.getRowModel();
  const headerGroups = table.getHeaderGroups();
  return (
    <>
      {rows.map((row) => {
        const cells = row.getVisibleCells();

        return (
          <tbody
            key={row.id}
            className={clsx(
              rowsConfig?.getRowClassName?.(row),
              '[&:last-child>tr:last-child>th]:rounded-bl-lg [&:not(:last-child)>tr:last-child>td]:border-b [&:not(:last-child)>tr:last-child>th]:border-b [&:nth-child(1)>tr:first-child>th]:rounded-tl-lg [&_tr:first-child_td]:pt-2 [&_tr:first-child_th]:h-[2.875rem] [&_tr:first-child_th]:pt-2 [&_tr:last-child_td]:pb-2 [&_tr:last-child_th]:h-[2.875rem] [&_tr:last-child_th]:pb-2',
            )}
          >
            {headerGroups.map((headerGroup) =>
              headerGroup.headers.map((header, index) => {
                const hasMoreActions = index === 0 && !!moreActions;
                const colSpan = hasMoreActions ? undefined : 2;

                return (
                  <TableRow
                    key={row.id + headerGroup.id + header.id}
                    itemHeight={rowsConfig?.virtualizedRowHeight ?? 0}
                    isEnabled={rowsConfig?.virtualizedRowHeight !== undefined}
                    className={clsx({
                      '[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100':
                        borders?.type === 'wide',
                    })}
                  >
                    <th
                      className={`
                        first-child:border-lg
                        h-[2.625rem]
                        border-r
                        border-r-gray-200
                        bg-gray-50
                        px-4
                        py-1
                        text-left
                        text-sm
                        font-normal
                      `}
                      style={{
                        width:
                          header.column.columnDef.staticSize ||
                          (header.column.getSize() !== 150
                            ? `${header.column.getSize()}px`
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
                      className={clsx('h-full text-left text-sm font-normal', {
                        'py-1 pl-4': !colSpan,
                        'px-4 py-1': colSpan,
                      })}
                      colSpan={colSpan}
                    >
                      {flexRender(
                        header.column.columnDef.cell,
                        cells[index].getContext(),
                      )}
                    </td>
                    {hasMoreActions && (
                      <td
                        className={clsx('px-4', moreActions?.wrapperClassName)}
                      >
                        {moreActions.renderMoreActions?.(row)}
                      </td>
                    )}
                  </TableRow>
                );
              }),
            )}
          </tbody>
        );
      })}
    </>
  );
};
