import React from 'react';
import { ColumnHelper } from '@tanstack/react-table';
import { TableWithMeatballMenuProps } from './types';
import MeatBallMenu from '~v5/shared/MeatBallMenu';

export const makeMenuColumn = <T,>(
  helper: ColumnHelper<T>,
  getMenuProps: TableWithMeatballMenuProps<T>['getMenuProps'],
  meatBallMenuSize = 60,
) =>
  helper.display({
    id: 'menu',
    size: meatBallMenuSize,
    minSize: meatBallMenuSize,
    cell: ({ row }) => {
      const props = getMenuProps(row);

      return props ? (
        <div className="absolute top-4 right-4 md:static md:top-auto md:right-auto">
          <MeatBallMenu {...props} />
        </div>
      ) : undefined;
    },
  });
