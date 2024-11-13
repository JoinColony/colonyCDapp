import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { isAddress } from 'ethers/lib/utils';
import React, { useMemo } from 'react';

import { useMobile } from '~hooks/index.ts';
import getMaskedAddress from '~shared/MaskedAddress/getMaskedAddress.ts';
import { formatText } from '~utils/intl.ts';
import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';

import CellDescription, {
  type CellDescriptionItem,
} from './CellDescription.tsx';

const getValueByType = ({ type, value, isFull }) => {
  if (type === 'address') {
    const address = getMaskedAddress({
      address: value,
      isFull,
    });
    return address.result;
  }

  return value;
};

export const useArbitraryTxsTableColumns = (): ColumnDef<
  AddTransactionTableModel,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<AddTransactionTableModel>(),
    [],
  );
  const isMobile = useMobile();

  const columns: ColumnDef<AddTransactionTableModel, string>[] = useMemo(
    () => [
      columnHelper.accessor('contractAddress', {
        enableSorting: false,
        header: () => (
          <span className="text-sm text-gray-600">
            {formatText({ id: 'table.row.contract' })}
          </span>
        ),
        cellContentWrapperClassName: '!justify-start',

        cell: ({ getValue }) => {
          const address = getValue();
          const isAddressValid = isAddress(address);
          const maskedAddress = getMaskedAddress({
            address,
          });
          return (
            <span className="flex max-w-full items-center gap-2">
              {isAddressValid && <UserAvatar userAddress={address} size={20} />}

              <span className="truncate text-md font-medium text-gray-900">
                {maskedAddress.result}
              </span>
            </span>
          );
        },
        size: isMobile ? 100 : 30,
      }),
      columnHelper.display({
        id: 'description',
        header: () => (
          <span className="text-sm text-gray-600">
            {formatText({ id: 'table.row.details' })}
          </span>
        ),
        cell: ({ row: { original } }) => {
          const data: CellDescriptionItem[] = [];
          if (original?.method) {
            data.push({
              title: 'Method',
              value: original?.method,
            });
          }
          if (original?.args) {
            Object.entries(original.args).forEach((item) => {
              data.push({
                title: item[0],
                value: getValueByType({
                  value: item[1].value,
                  type: item[1].type,
                  isFull: !isMobile,
                }),
              });
            });
          }
          return <CellDescription data={data} />;
        },
        size: isMobile ? 100 : 67,
      }),
    ],
    [columnHelper, isMobile],
  );

  return columns;
};
