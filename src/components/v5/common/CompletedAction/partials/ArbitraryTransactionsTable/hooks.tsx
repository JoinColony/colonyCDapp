import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { isAddress } from 'ethers/lib/utils';
import React, { useMemo } from 'react';

import { useTablet } from '~hooks/index.ts';
import getMaskedAddress from '~shared/MaskedAddress/getMaskedAddress.ts';
import { formatText } from '~utils/intl.ts';
import CellDescription, {
  type CellDescriptionItem,
} from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/partials/ArbitraryTransactionsTable/CellDescription.tsx';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';

import { type CompletedArbitraryTransactions } from '../ArbitraryTransaction/hooks.ts';

import { EncodedTransactionCell } from './EncodedTransactionCell.tsx';

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
  CompletedArbitraryTransactions,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<CompletedArbitraryTransactions>(),
    [],
  );
  const isTablet = useTablet();

  const columns: ColumnDef<CompletedArbitraryTransactions, string>[] = useMemo(
    () => [
      columnHelper.accessor('contractAddress', {
        enableSorting: false,
        header: () => (
          <div className="pt-1.5 text-sm text-gray-600 md:pt-0">
            {formatText({ id: 'table.row.contract' })}
          </div>
        ),
        cellContentWrapperClassName: '!justify-start',
        cell: ({ getValue }) => {
          const address = getValue();
          const isAddressValid = isAddress(address);
          const maskedAddress = getMaskedAddress({
            address,
          });

          return (
            <span className="flex max-w-full items-center gap-2 pt-1">
              {isAddressValid && <UserAvatar userAddress={address} size={20} />}

              <span className="truncate text-md font-medium text-gray-900">
                {maskedAddress.result}
              </span>
            </span>
          );
        },
        staticSize: isTablet ? '97px' : '30%',
      }),
      columnHelper.display({
        id: 'description',
        header: () => (
          <div className="pt-1.5 text-sm text-gray-600  md:pt-0">
            {formatText({ id: 'table.row.details' })}
          </div>
        ),
        cell: ({ row: { original: transaction } }) => {
          const data: CellDescriptionItem[] = [];

          if (transaction.encodedFunction) {
            return (
              <EncodedTransactionCell
                encodedFunction={transaction.encodedFunction}
              />
            );
          }

          if (transaction.method) {
            data.push({
              name: 'Method',
              value: transaction.method,
            });
          }
          if (transaction.args) {
            transaction.args?.forEach(({ name, type, value }) => {
              data.push({
                name: `${name} (${type})`,
                value: getValueByType({
                  value,
                  type,
                  isFull: !isTablet,
                }),
              });
            });
          }
          return <CellDescription data={data} />;
        },
        staticSize: isTablet ? '97px' : '67%',
      }),
    ],
    [columnHelper, isTablet],
  );

  return columns;
};
