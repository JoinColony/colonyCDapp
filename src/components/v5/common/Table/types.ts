import { ColumnDef } from '@tanstack/react-table';
import { MessageDescriptor } from 'react-intl';

export interface TableProps<T> {
  className?: string;
  tableTitle?: MessageDescriptor;
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
  canRemoveRow?: boolean;
  canDuplicateRow?: boolean;
  onRemoveRow?: () => void;
  onDuplicateRow?: () => void;
}
