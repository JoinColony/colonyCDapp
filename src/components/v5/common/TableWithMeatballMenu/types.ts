import { Row } from '@tanstack/react-table';

import { MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import { TableProps } from '../Table/types.ts';

export interface TableWithMeatballMenuProps<T> extends TableProps<T> {
  getMenuProps: (row: Row<T>) => MeatBallMenuProps | undefined;
  meatBallMenuSize?: number;
  meatBallMenuStaticSize?: string;
}
