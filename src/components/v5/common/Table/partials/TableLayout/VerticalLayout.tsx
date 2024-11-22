import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';

import { TableRow } from '../VirtualizedRow/VirtualizedRow.tsx';

import { type VerticalLayoutProps } from './types.ts';

export const VerticalLayout = <T,>({
  rows,
  headerGroups,
  getRowClassName,
  getMenuProps,
  virtualizedProps,
  sizeUnit,
  meatBallMenuSize,
  meatBallMenuStaticSize,
  withBorder,
}: VerticalLayoutProps<T>) => {
  return (
    <>
      {rows.map((row) => {
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
                const hasMeatballMenu =
                  !!meatBallMenuProps && rowWithMeatBallMenu;
                const width = meatBallMenuSize || meatBallMenuStaticSize;
                const colSpan = hasMeatballMenu ? undefined : 2;

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
                    {hasMeatballMenu && (
                      <td
                        className="px-4"
                        style={{
                          ...(width && { width: `${width}${sizeUnit}` }),
                        }}
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
      })}
    </>
  );
};
