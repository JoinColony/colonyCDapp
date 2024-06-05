import { type ColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';

import { MEATBALL_MENU_COLUMN_ID } from './consts.ts';
import { type RenderCellWrapper, type TableProps } from './types.ts';

export const getDefaultRenderCellWrapper =
  <T,>(): RenderCellWrapper<T> =>
  (cellClassName, content) => <div className={cellClassName}>{content}</div>;

export const makeMenuColumn = <T,>({
  helper,
  getMenuProps,
  meatBallMenuSize = 60,
  meatBallMenuStaticSize,
}: {
  helper: ColumnHelper<T>;
  getMenuProps: TableProps<T>['getMenuProps'];
  meatBallMenuSize?: number;
  meatBallMenuStaticSize: string | undefined;
}) =>
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
        <MeatBallMenu
          {...props}
          buttonClassName="ml-auto"
          contentWrapperClassName={clsx(
            props.contentWrapperClassName,
            '!z-sidebar',
          )}
        />
      ) : undefined;
    },
  });
