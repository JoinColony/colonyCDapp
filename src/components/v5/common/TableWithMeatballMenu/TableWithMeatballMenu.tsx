import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Table from '~v5/common/Table';
import { TableWithMeatballMenuProps } from './types';
import { makeMenuColumn } from './utils';

const displayName = 'v5.common.TableWithMeatballMenu';

const TableWithMeatballMenu = <T,>({
  getMenuProps,
  columns,
  ...rest
}: TableWithMeatballMenuProps<T>) => {
  const helper = useMemo(() => createColumnHelper<T>(), []);
  const columnsWithMenu = useMemo(
    () => [...columns, makeMenuColumn<T>(helper, getMenuProps)],
    [columns, helper, getMenuProps],
  );

  return <Table<T> columns={columnsWithMenu} {...rest} />;
};

TableWithMeatballMenu.displayName = displayName;

export default TableWithMeatballMenu;
