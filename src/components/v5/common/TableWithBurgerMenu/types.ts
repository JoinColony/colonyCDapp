import {
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { TableProps } from '../Table/types';

export interface TableActionsProps {
  fields: Record<'id', string>[];
  append: UseFieldArrayAppend<FieldValues, string>;
  remove: UseFieldArrayRemove;
}

export interface TableWithBurgerMenuProps<T>
  extends Omit<TableProps<T>, 'fields'>,
    TableActionsProps {
  actions: TableActionsProps;
  formValues: T[];
}

export type TableActions<T> = TableWithBurgerMenuProps<T>;

export interface TableActionColumn {
  id: number;
  key: number;
  menu: string;
}
