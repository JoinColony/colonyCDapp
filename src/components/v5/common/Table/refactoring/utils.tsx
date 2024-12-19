import { type ColumnHelper, type Row } from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import { MEATBALL_MENU_COLUMN_ID } from '../consts.ts';

import { EmptyContentWrapper } from './partials/EmptyContentWrapper.tsx';

export const getHorizontalRowClasses = ({
  className = '',
  isExpandable,
  showExpandableContent,
  hasNarrowBorders,
  hasWideBorders,
  hasMoreActions,
}) =>
  clsx(className, {
    'translate-z-0 relative [&>tr:first-child>td]:pr-9 [&>tr:last-child>td]:p-0 [&>tr:last-child>th]:p-0':
      hasMoreActions,
    '[&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100':
      (!showExpandableContent && isExpandable && !hasNarrowBorders) ||
      hasWideBorders,
    'expanded-below': showExpandableContent,
  });

export const getHorizontalRowKey = ({ row, rowKeyProp, data }) => {
  const rowKey = rowKeyProp ? data[row.index]?.[rowKeyProp] : null;
  return typeof rowKey === 'string' || typeof rowKey === 'number'
    ? rowKey
    : row.id;
};

export const renderCellContent = (
  _,
  content: React.ReactNode,
): React.ReactNode => content;

export const getMoreActionsMenu = <T,>({
  getMenuProps,
  wrapperClassName = 'w-[3.75rem]',
  visible = true,
}) => ({
  wrapperClassName,
  renderMoreActions: (row: Row<T>) => {
    const menuProps = getMenuProps(row);
    return visible && menuProps ? (
      <MeatBallMenu
        {...menuProps}
        buttonClassName="ml-auto"
        contentWrapperClassName={clsx(
          menuProps.contentWrapperClassName,
          '!left-1 !right-6 !z-sidebar sm:!left-auto',
        )}
      />
    ) : null;
  },
});

export const makeMenuColumn = <T,>({
  helper,
  getMenuProps,
  cellProps = {
    size: 60,
  },
}: {
  helper: ColumnHelper<T>;
  getMenuProps: (row: Row<T>) => MeatBallMenuProps | undefined;
  cellProps?: {
    size?: number;
    staticSize?: string;
  };
}) => {
  return helper.display({
    id: MEATBALL_MENU_COLUMN_ID,
    size: cellProps.size,
    minSize: cellProps.size,
    staticSize: cellProps.staticSize,
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
};

export const renderEmptyContent = ({
  shouldShowEmptyContent,
  emptyContent,
  colSpan,
}) => {
  if (!shouldShowEmptyContent) return null;

  return (
    <EmptyContentWrapper colSpan={colSpan}>{emptyContent}</EmptyContentWrapper>
  );
};
