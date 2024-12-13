import clsx from 'clsx';
import React from 'react';

import { TableFooter } from '~v5/common/Table/partials/TableFooter.tsx';
import { getDefaultRenderCellWrapper } from '~v5/common/Table/utils.tsx';

import {
  type HorizontalTableLayoutProps,
  type VerticalTableLayoutProps,
  type BaseTableProps,
} from '../types.ts';

import { HorizontalTableLayout } from './TableLayout/HorizontalTableLayout.tsx';
import { VerticalTableLayout } from './TableLayout/VerticalTableLayout.tsx';

export const BaseTable = <T,>({
  className,
  tableClassName,
  borders = {
    visible: true,
    type: 'wide',
  },
  layout = 'horizontal',
  footerColSpan,
  table,
  renderCellWrapper = getDefaultRenderCellWrapper<T>(),
  isDisabled = false,
  showTableHead = true,
  children,
  ...rest
}: BaseTableProps<T>) => {
  return (
    <div
      className={clsx(className, {
        'border-separate border-spacing-0 rounded-lg border border-gray-200':
          borders.visible,
      })}
    >
      <table
        className={clsx('w-full table-fixed', tableClassName)}
        cellPadding="0"
        cellSpacing="0"
      >
        {layout === 'vertical' ? (
          <VerticalTableLayout
            {...({
              ...rest,
              table,
              borders,
              isDisabled,
              showTableHead,
            } as VerticalTableLayoutProps<T>)}
          />
        ) : (
          <HorizontalTableLayout
            {...({
              ...rest,
              table,
              borders,
              renderCellWrapper,
              isDisabled,
              showTableHead,
            } as HorizontalTableLayoutProps<T>)}
          />
        )}
        <TableFooter
          colSpan={footerColSpan}
          hasBorder={layout === 'horizontal'}
          groups={table.getFooterGroups()}
        />
      </table>
      {children}
    </div>
  );
};
