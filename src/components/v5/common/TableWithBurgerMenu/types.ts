import {
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormGetValues,
} from 'react-hook-form';
import { TableProps } from '../Table/types';

export interface TableWithBurgerMenuProps
  extends Pick<TableProps, 'tableTitle' | 'columns'> {
  actions: {
    fields: Record<'id', string>[];
    append: UseFieldArrayAppend<FieldValues>;
    remove: UseFieldArrayRemove;
    getValues: UseFormGetValues<FieldValues>;
  };
}
