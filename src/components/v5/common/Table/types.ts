import { ColumnDef } from '@tanstack/react-table';

export interface TableProps<T> {
  className?: string;
  tableTitle?: React.ReactNode;
  columns: ColumnDef<T>[];
  action: {
    actionText: React.ReactNode;
    type: string;
    actionData: { [key: string]: unknown };
  };
  isMenuVisible: boolean;
  onToogle: () => void;
  onToogleOff: () => void;
}

export interface BurgerMenuProps
  extends Pick<TableProps, 'onToogle' | 'onToogleOff' | 'isMenuVisible'> {
  onRemoveRow?: () => void;
  onDuplicateRow?: () => void;
}
