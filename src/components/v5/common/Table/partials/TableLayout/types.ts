import { type HeaderGroup, type Row } from '@tanstack/react-table';
import { type PropsWithChildren } from 'react';

import { type TableProps } from '~v5/common/Table/types.ts';

export type BaseTableLayoutProps<T> = Pick<
  TableProps<T>,
  | 'verticalLayout'
  | 'getMenuProps'
  | 'virtualizedProps'
  | 'sizeUnit'
  | 'withBorder'
> &
  Required<Pick<TableProps<T>, 'getRowClassName'>> & {
    rows: Row<T>[];
    headerGroups: HeaderGroup<T>[];
  } & PropsWithChildren;

export type HorizontalLayoutProps<T> = BaseTableLayoutProps<T> &
  Pick<
    TableProps<T>,
    | 'showTableHead'
    | 'emptyContent'
    | 'renderSubComponent'
    | 'tableBodyRowKeyProp'
    | 'withNarrowBorder'
    | 'isDisabled'
    | 'data'
  > &
  Required<Pick<TableProps<T>, 'renderCellWrapper'>> & {
    totalColumnsCount: number;
  };

export type VerticalLayoutProps<T> = BaseTableLayoutProps<T> &
  Pick<TableProps<T>, 'meatBallMenuSize' | 'meatBallMenuStaticSize'>;

export type TableLayoutProps<T> =
  | HorizontalLayoutProps<T>
  | VerticalLayoutProps<T>;
