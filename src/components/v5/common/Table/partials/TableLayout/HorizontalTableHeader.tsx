import { ArrowDown } from '@phosphor-icons/react';
import { flexRender, type HeaderGroup } from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

import { type HorizontalLayoutProps } from './types.ts';

type HorizontalTableHeaderProps<T> = Pick<
  HorizontalLayoutProps<T>,
  'sizeUnit'
> & {
  groups: HeaderGroup<T>[];
  disabled?: boolean;
};

export const HorizontalTableHeader = <T,>({
  groups,
  disabled,
  sizeUnit,
}: HorizontalTableHeaderProps<T>) => {
  return (
    <thead>
      {groups.map((group) => (
        <tr key={group.id}>
          {group.headers.map((header) => (
            <th
              key={header.id}
              className={clsx(
                header.column.columnDef.headCellClassName,
                'group border-b border-b-gray-200 bg-gray-50 px-[1.125rem] py-2.5 text-left text-sm font-normal text-gray-600 first:rounded-tl-lg last:rounded-tr-lg empty:p-0',
                {
                  'cursor-pointer': header.column.getCanSort() && !disabled,
                },
              )}
              onClick={
                disabled ? undefined : header.column.getToggleSortingHandler()
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
                        header.column.getIsSorted() === 'asc' && !disabled,
                      'rotate-0':
                        header.column.getIsSorted() === 'desc' && !disabled,
                      'opacity-0 group-hover:opacity-100':
                        header.column.getIsSorted() === false || disabled,
                    },
                  )}
                />
              ) : null}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};
