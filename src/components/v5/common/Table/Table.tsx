import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import styles from './Table.module.css';

type TableProps = PropsWithChildren<{ className?: string }>;

const displayName = 'v5.common.Table';

const Table = ({ children, className }: TableProps) => {
  return (
    <table
      className={clsx(styles.table, className)}
      cellPadding="0"
      cellSpacing="0"
    >
      {children}
    </table>
  );
};

Table.displayName = displayName;
export default Table;
