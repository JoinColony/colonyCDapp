import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createColumnHelper } from '@tanstack/react-table';
import BurgerMenu from '~v5/common/Table/partials/BurgerMenu';
import Table from '~v5/common/Table';
import useToggle from '~hooks/useToggle';
import { TableWithBurgerMenuProps } from '../Table/types';

const displayName = 'v5.common.TableWithBurgerMenu';

const TableWithBurgerMenu = <T,>({
  className,
  tableTitle,
  columns,
  actions,
}: TableWithBurgerMenuProps<T>) => {
  const columnHelper = createColumnHelper();
  const [selectedRowId, setSelectedRowId] = useState<string>();
  const [
    isMenuVisible,
    { toggle: onToogle, toggleOff: onToogleOff, registerContainerRef },
  ] = useToggle();
  const { fields, append, remove, getValues } = actions;

  const burgerColumn = [
    columnHelper.accessor('menu', {
      header: () => '',
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => (
        <BurgerMenu
          isMenuVisible={isMenuVisible && row.id === selectedRowId}
          onToogle={onToogle}
          onToogleOff={onToogleOff}
          onRemoveRow={() => remove(row.id)}
          registerContainerRef={registerContainerRef}
          onDuplicateRow={() => {
            const values = getValues().payments;
            const selectedRow = values.find(
              (item) => item.key === row.original.key,
            );
            if (selectedRow) {
              append([
                {
                  ...selectedRow,
                  key: uuidv4(),
                },
              ]);
            }
          }}
        />
      ),
    }),
  ];

  return (
    <Table<T>
      className={className}
      tableTitle={tableTitle}
      columns={columns}
      burgerColumn={burgerColumn}
      fields={fields}
      setSelectedRowId={setSelectedRowId}
    />
  );
};

TableWithBurgerMenu.displayName = displayName;

export default TableWithBurgerMenu;
