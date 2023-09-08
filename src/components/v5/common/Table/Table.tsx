import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { useFieldArray, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import { TableProps } from './types';
import Button from '~v5/shared/Button';
import { useMobile } from '~hooks';
import BurgerMenu from '~v5/common/Table/partials/BurgerMenu';

const displayName = 'v5.common.Table';

const Table = <T,>({
  className,
  tableTitle,
  columns,
  action,
  isMenuVisible,
  onToogle,
  onToogleOff,
  registerContainerRef,
}: TableProps<T>) => {
  const isMobile = useMobile();
  const { type, actionData, actionText } = action;
  const [selectedRowId, setSelectedRowId] = useState<string>();
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: type,
  });

  const columnHelper = createColumnHelper();

  const burgerColumn = [
    columnHelper.accessor('menu', {
      header: () => '',
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => (
        <BurgerMenu
          isMenuVisible={isMenuVisible && row.id === selectedRowId}
          onToogle={onToogle}
          onToogleOff={onToogleOff}
          onRemoveRow={() => remove(row.index)}
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

  const table = useReactTable({
    data: fields,
    columns: [...columns, ...burgerColumn],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={className}>
      {tableTitle && <h5 className="text-2 mb-3">{tableTitle}</h5>}
      {!!fields?.length && (
        <div className="border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="h-[2.1875rem] bg-gray-50 rounded-t-lg border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="w-1/3 text-left text-sm text-gray-600 font-normal rounded-t-lg px-4"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                const lastRow =
                  table.getRowModel().rows[table.getRowModel().rows.length - 1];
                return (
                  <tr
                    key={row.id}
                    className={clsx('h-[3.125rem] relative', {
                      'border-b border-b-gray-200': lastRow.id !== row.id,
                    })}
                    onClick={() => setSelectedRowId(row.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 text-md text-gray-500">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Button
        mode="primaryOutline"
        iconName="plus"
        size="small"
        className="mt-6"
        isFullSize={isMobile}
        onClick={() => {
          append(actionData);
        }}
      >
        {actionText}
      </Button>
    </div>
  );
};

Table.displayName = displayName;

export default Table;
