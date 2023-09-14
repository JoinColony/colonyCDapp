import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createColumnHelper } from '@tanstack/react-table';
import { TableActionColumn, TableActionsProps } from './types';

export const tableActions = <T,>(actions: TableActionsProps<T>, formValues: T[]) => {
  const { append, remove } = actions;

  const columnHelper = createColumnHelper<TableActionColumn>();

  return [
    columnHelper.accessor('menu', {
      header: () => '',
      cell: ({ row }) => (
        // @TODO: add burger menu
        <div>
          <button
            type="button"
            onClick={() => {
              const selectedRow = formValues.find(
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
          >
            duplicate
          </button>
          <button type="button" onClick={() => remove(row.id)}>
            remove
          </button>
        </div>
      ),
    }),
  ];
};
