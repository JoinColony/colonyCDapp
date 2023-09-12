import { ColumnDef } from '@tanstack/react-table';

export interface TableProps<T> {
  className?: string;
  tableTitle?: React.ReactNode;
  columns: ColumnDef<T>[];
  fields: T[];
  burgerColumn: ColumnDef<T, any>[];
  setSelectedRowId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export interface BurgerMenuProps {
  isMenuVisible: boolean;
  onRemoveRow: () => void;
  onToogle: () => void;
  onToogleOff: () => void;
  onDuplicateRow: () => void;
  registerContainerRef: (ref: HTMLElement | null) => void;
}
