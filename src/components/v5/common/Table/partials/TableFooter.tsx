import { flexRender, type HeaderGroup } from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

interface TableFooterProps<T> {
  colSpan?: number;
  hasBorder?: boolean;
  groups: HeaderGroup<T>[];
}

export const TableFooter = <T,>({
  colSpan,
  hasBorder,
  groups,
}: TableFooterProps<T>) => {
  const hasFooter = groups.map((footerGroup) =>
    footerGroup.headers
      .map((column) => column.column.columnDef)
      .some((columnDef) => columnDef.footer),
  )[0];

  if (!hasFooter) {
    return null;
  }

  return (
    <tfoot>
      {groups.map((footerGroup) => (
        <tr key={footerGroup.id}>
          {footerGroup.headers.map((column, index) => {
            const isLastColumn = index === footerGroup.headers.length - 1;

            return (
              <td
                colSpan={isLastColumn ? colSpan : 1}
                key={column.id}
                className={clsx('h-full px-[1.1rem] text-md text-gray-500', {
                  'border-t border-gray-200': hasBorder,
                })}
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
  );
};
