import { type PropsWithChildren } from 'react';

export interface VirtualizedRowProps extends PropsWithChildren {
  className: string;
  itemHeight: number;
}

export interface TableRowProps extends VirtualizedRowProps {
  isEnabled?: boolean;
}
