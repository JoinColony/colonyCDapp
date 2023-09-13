import React from 'react';
import Table from '~v5/common/Table';
import { TableWithBurgerMenuProps } from '../Table/types';
import { useTableWithBurgerMenu } from './hooks';

const displayName = 'v5.common.TableWithBurgerMenu';

const TableWithBurgerMenu = <T,>({
  className,
  tableTitle,
  columns,
  actions,
}: TableWithBurgerMenuProps<T>) => {
  const burgerColumn = useTableWithBurgerMenu(actions);
  const { fields } = actions;

  return (
    <Table<T>
      className={className}
      tableTitle={tableTitle}
      columns={[...columns, ...burgerColumn]}
      fields={fields}
    />
  );
};

TableWithBurgerMenu.displayName = displayName;

export default TableWithBurgerMenu;
