import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createColumnHelper } from '@tanstack/react-table';

export const useTableWithBurgerMenu = (actions) => {
  const { append, remove, getValues } = actions;

  const columnHelper = createColumnHelper();

  const burgerColumn = [
    columnHelper.accessor('menu', {
      header: () => '',
      cell: ({ row }) => (
        // @TODO: add burger menu
        <div>
          <button
            type="button"
            onClick={() => {
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

  return burgerColumn;
};
