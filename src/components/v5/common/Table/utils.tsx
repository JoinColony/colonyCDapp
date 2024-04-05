import { type ColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';

import { MEATBALL_MENU_COLUMN_ID } from './consts.ts';
import { type RenderCellWrapper, type TableProps } from './types.ts';

export const getDefaultRenderCellWrapper =
  <T,>(): RenderCellWrapper<T> =>
  (cellClassName, content) => <div className={cellClassName}>{content}</div>;

export const makeMenuColumn = <T,>(
  helper: ColumnHelper<T>,
  getMenuProps: TableProps<T>['getMenuProps'],
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
      const props = getMenuProps?.(row);

      return props ? (
        <div
          className={clsx({
            'absolute right-4 top-1/2 -translate-y-1/2': verticalOnMobile,
          })}
        >
          <MeatBallMenu
            {...props}
            contentWrapperClassName={clsx(
              props.contentWrapperClassName,
              '!z-sidebar',
            )}
          />
        </div>
      ) : undefined;
    },
  });
