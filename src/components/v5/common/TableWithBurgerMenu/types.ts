import { TableProps } from '../Table/types';

export interface TableWithBurgerMenuProps
  extends Pick<TableProps, 'tableTitle' | 'columns'> {
  actions: {
    fields: TableProps[];
    append: () => void;
    remove: () => void;
    getValues: () => void;
  };
}
