import React, { ReactNode, TdHTMLAttributes } from 'react';

interface Props extends TdHTMLAttributes<unknown> {
  className?: string;
  children: ReactNode;
}

const displayName = 'TableCell';

const TableCell = ({ children, ...props }: Props) => (
  <td {...props}>{children}</td>
);

TableCell.displayName = displayName;

export default TableCell;
