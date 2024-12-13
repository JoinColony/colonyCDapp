import { flexRender, type Row, type Cell } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { type CSSProperties } from 'react';

import { type HorizontalTableLayoutProps } from '~v5/common/Table/types.ts';
import { getDefaultRenderCellWrapper } from '~v5/common/Table/utils.tsx';

type HorizontalTableCellProps<T> = {
  isDisabled?: boolean;
  style?: CSSProperties;
  row: Row<T>;
  cell: Cell<T, unknown>;
} & Pick<HorizontalTableLayoutProps<T>, 'renderCellWrapper'>;

export const HorizontalTableCell = <T,>({
  isDisabled,
  style,
  row,
  cell,
  renderCellWrapper,
}: HorizontalTableCellProps<T>) => {
  const renderCellWrapperCommonArgs = [
    clsx(
      'flex h-full flex-col items-start justify-center p-4 text-md',
      {
        'text-gray-500': !isDisabled,
        'text-gray-300': isDisabled,
      },
      cell.column.columnDef.cellContentWrapperClassName,
    ),
    flexRender(cell.column.columnDef.cell, cell.getContext()),
  ] as const;

  const colSpan =
    typeof cell.column.columnDef.colSpan === 'number'
      ? cell.column.columnDef.colSpan
      : cell.column.columnDef.colSpan?.(row.getIsExpanded());

  const hideCell = colSpan === 0;

  return (
    <td
      key={cell?.id}
      className={clsx('h-full', {
        hidden: hideCell,
      })}
      colSpan={colSpan}
      style={style}
    >
      {renderCellWrapper(...renderCellWrapperCommonArgs, {
        cell,
        row,
        renderDefault: () =>
          getDefaultRenderCellWrapper<T>()(...renderCellWrapperCommonArgs, {
            cell,
            row,
            renderDefault: () => null,
          }),
      })}
    </td>
  );
};
