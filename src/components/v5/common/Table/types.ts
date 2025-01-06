import {
  type TableOptions,
  type Row,
  type Cell,
  type Table,
  type ColumnDef,
  type RowModel,
  type OnChangeFn,
  type RowSelectionState,
} from '@tanstack/react-table';
import { type PropsWithChildren } from 'react';

export type NullableColumnDef<T> = ColumnDef<T, string> | null;

export type RenderCellWrapper<T> = (
  className: string,
  content: React.ReactNode,
  context: {
    cell: Cell<T, unknown>;
    row: Row<T>;
    renderDefault: () => React.ReactNode;
  },
) => React.ReactNode;

export interface MoreActionsOptions<T> {
  renderMoreActions?: (row: Row<T>) => React.ReactElement | null; // Actions menu rendering based on row
  wrapperClassName?: string; // Actions menu wrapper class name
}

export interface TableRowOptions<T> {
  getRowClassName?: (row: Row<T>) => string | undefined; // Class name generator for rows
  key?: Extract<keyof T, React.Key>; // Unique key for rows
  virtualizedRowHeight?: number; // Enable row virtualization
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement; // Sub-component rendering
  canExpand?: (row: Row<T>) => boolean; // Row expansion logic
}

type PaginationDirection = 'previous' | 'next';

export interface PaginationOptions {
  pageSize?: number; // Number of rows per page
  canNextPage?: boolean; // Enable "next page"
  canPreviousPage?: boolean; // Enable "previous page"
  onPageChange?: (direction: PaginationDirection) => void; // Custom handler on page change
  disabled?: boolean; // Disable pagination
  visible?: boolean; // Control visibility
  pageNumberVisible?: boolean; // Show current page number
  pageTotalVisible?: boolean; // Show total pages
  children?: React.ReactNode; // Custom buttons
}

export interface TableOptionsOverrides<T> {
  getCoreRowModel?: TableOptions<T>['getCoreRowModel'];
  initialState?: Partial<{
    sorting: Array<{ id: string; desc: boolean }>;
    pagination: { pageIndex: number; pageSize: number };
  }>;
  state?: {
    columnVisibility?: Record<string, boolean>;
    sorting?: Array<{
      id: string;
      desc: boolean;
    }>;
    pagination?: {
      pageIndex: number;
      pageSize: number;
    };
    rowSelection?: Record<string, boolean>;
  };
  manualPagination?: boolean;
  pageCount?: number;
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void;
  getRowId?: (row: T, index: number) => string;
  isMultiSortEvent?: () => boolean;
  enableSorting?: boolean;
  enableSortingRemoval?: boolean;
  sortDescFirst?: boolean;
  getSortedRowModel?: (table: Table<T>) => () => RowModel<T>;
  getPaginationRowModel?: (table: Table<T>) => () => RowModel<T>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  getFilteredRowModel?: (table: Table<T>) => () => RowModel<T>;
}

export interface BaseTableOptions<T>
  extends Pick<TableOptions<T>, 'data' | 'columns'> {
  className?: string; // General class name
  tableClassName?: string; // Table-specific class name
  emptyContent?: React.ReactNode; // Custom empty state
  isDisabled?: boolean; // Disable interactions
  layout?: 'horizontal' | 'vertical'; // Table layout
  borders?: {
    type?: 'narrow' | 'wide' | 'unset'; // Border width
    visible?: boolean; // Show/hide borders
  };
  showTableHead?: boolean; // Show/hide table header
  footerColSpan?: number; // Span of footer columns
  renderCellWrapper?: RenderCellWrapper<T>; // Wrapper for cell rendering
}

export interface BaseTableProps<T> extends BaseTableOptions<T> {
  table: Table<T>; // React Table instance
  rows?: TableRowOptions<T>; // Row-specific options
  moreActions?: MoreActionsOptions<T>; // Actions menu options
  overrides?: TableOptionsOverrides<T>; // Overrides for advanced customization based on the TableOptions provided by @tanstack/react-table
  children?: React.ReactNode; // Custom children
}

export interface TableProps<T> extends Omit<BaseTableProps<T>, 'table'> {
  pagination?: PaginationOptions; // Pagination-specific options
}

export type BaseTableLayoutProps<T> = Pick<
  BaseTableProps<T>,
  'table' | 'layout' | 'moreActions' | 'borders' | 'rows'
> &
  PropsWithChildren;

export type HorizontalTableLayoutProps<T> = BaseTableLayoutProps<T> &
  Pick<
    BaseTableProps<T>,
    | 'showTableHead'
    | 'moreActions'
    | 'emptyContent'
    | 'borders'
    | 'isDisabled'
    | 'data'
  > &
  Required<Pick<BaseTableProps<T>, 'renderCellWrapper'>>;

export type VerticalTableLayoutProps<T> = BaseTableLayoutProps<T>;

export type TableLayoutProps<T> =
  | HorizontalTableLayoutProps<T>
  | VerticalTableLayoutProps<T>;
