import {
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { TableProps } from '../Table/types';

interface FieldsActions {
  fields: Record<'id', string>[];
  append: UseFieldArrayAppend<FieldValues, string>;
  remove: UseFieldArrayRemove;
}

export type TableActionsProps = FieldsActions;

export interface TableWithBurgerMenuProps<T>
  extends Omit<TableProps<T>, 'fields'> {
  actions: FieldsActions;
  formValues: T[];
}

export type TableActions<T> = TableWithBurgerMenuProps<T>;

export interface TableActionColumn {
  id: number;
  key: number;
  menu: string;
}
