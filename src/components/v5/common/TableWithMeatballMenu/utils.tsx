import React from 'react';
import { ColumnHelper } from '@tanstack/react-table';
import { TableWithMeatballMenuProps } from './types';
import MeatBallMenu from '~v5/shared/MeatBallMenu';

export const makeMenuColumn = <T,>(
  helper: ColumnHelper<T>,
  getMenuProps: TableWithMeatballMenuProps<T>['getMenuProps'],
) =>
  helper.display({
    id: 'menu',
    cell: ({ row }) => (
      <MeatBallMenu
        {...getMenuProps(row)}
        cardClassName="sm:max-w-[11.0625rem]"
      />
    ),
  });
