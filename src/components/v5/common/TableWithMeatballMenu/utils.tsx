import { type ColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';

import { MEATBALL_MENU_COLUMN_ID } from './consts.ts';
import { type TableWithMeatballMenuProps } from './types.ts';

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
