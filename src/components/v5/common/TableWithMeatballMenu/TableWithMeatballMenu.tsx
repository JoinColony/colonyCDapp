import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Table from '~v5/common/Table';
import { TableWithMeatballMenuProps } from './types';
import { makeMenuColumn } from './utils';

const displayName = 'v5.common.TableWithMeatballMenu';

const TableWithMeatballMenu = <T,>({
  getMenuProps,
  columns,
  meatBallMenuSize,
  verticalOnMobile = true,
  meatBallMenuStaticSize,
  ...rest
}: TableWithMeatballMenuProps<T>) => {
  const helper = useMemo(() => createColumnHelper<T>(), []);
  const columnsWithMenu = useMemo(
    () => [
      ...columns,
      makeMenuColumn<T>(
        helper,
        getMenuProps,
        meatBallMenuSize,
        verticalOnMobile,
        meatBallMenuStaticSize,
      ),
    ],
    [
      columns,
      helper,
      getMenuProps,
      meatBallMenuSize,
      verticalOnMobile,
      meatBallMenuStaticSize,
    ],
  );

  return (
    <Table<T>
      verticalOnMobile={verticalOnMobile}
      getRowClassName={() =>
        'relative translate-z-0 [&>tr:last-child>th]:p-0 [&>tr:last-child>td]:p-0 [&>tr:first-child>td]:pr-9'
      }
      columns={columnsWithMenu}
      {...rest}
    />
  );
};

TableWithMeatballMenu.displayName = displayName;

export default TableWithMeatballMenu;
