import React from 'react';
import { ColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';

import MeatBallMenu from '~v5/shared/MeatBallMenu';

import { TableWithMeatballMenuProps } from './types';
import { MEATBALL_MENU_COLUMN_ID } from './consts';

export const makeMenuColumn = <T,>(
  helper: ColumnHelper<T>,
  getMenuProps: TableWithMeatballMenuProps<T>['getMenuProps'],
  meatBallMenuSize = 60,
  verticalOnMobile = true,
  meatBallMenuStaticSize: string | undefined,
) =>
  helper.display({
    id: MEATBALL_MENU_COLUMN_ID,
    ...(meatBallMenuStaticSize
      ? { staticSize: meatBallMenuStaticSize }
      : {
          size: meatBallMenuSize,
          minSize: meatBallMenuSize,
        }),
    cell: ({ row }) => {
      const props = getMenuProps(row);

      return props ? (
        <div
          className={clsx({
            'absolute top-4 right-4': verticalOnMobile,
          })}
        >
          <MeatBallMenu {...props} />
        </div>
      ) : undefined;
    },
  });
