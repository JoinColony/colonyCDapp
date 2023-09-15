import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Table from '~v5/common/Table';
import { TableWithBurgerMenuProps } from './types';
import { tableActions } from './tableActions';

const displayName = 'v5.common.TableWithBurgerMenu';

const TableWithBurgerMenu = <T extends { key: number }>({
  className,
  tableTitle,
  columns,
  actions,
  formValues,
}: TableWithBurgerMenuProps<T>) => {
  const actionsColumn = tableActions<T>(actions, formValues) as ColumnDef<T>[];
  const { fields } = actions;

  return (
    <Table<T>
      className={className}
      tableTitle={tableTitle}
      columns={[...columns, ...actionsColumn]}
      fields={fields}
    />
  );
};

TableWithBurgerMenu.displayName = displayName;

export default TableWithBurgerMenu;
