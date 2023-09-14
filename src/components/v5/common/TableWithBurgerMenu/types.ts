import {
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  FieldArrayPath
} from 'react-hook-form';
import { TableProps } from '../Table/types';

export interface TableActionsProps<T> {
  fields: T[];
  append: UseFieldArrayAppend<FieldValues, FieldArrayPath<FieldValues>>;
  remove: UseFieldArrayRemove;
}

export interface TableWithBurgerMenuProps<T> extends Omit<TableProps<T>, 'fields'> extends TableActionsProps {
  actions: TableActionsProps<T>;
  formValues: T[];
}

export interface TableActions<T> extends TableWithBurgerMenuProps<T> {}

export interface TableActionColumn {
  key: number;
  menu: string;
}
