import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { isAddress } from 'ethers/lib/utils';
import React, { useMemo } from 'react';

import { useTablet } from '~hooks/index.ts';
import getMaskedAddress from '~shared/MaskedAddress/getMaskedAddress.ts';
import { decodeArbitraryTransaction } from '~utils/arbitraryTxs.ts';
import { formatText } from '~utils/intl.ts';
import CellDescription, {
  type CellDescriptionItem,
} from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/partials/ArbitraryTransactionsTable/CellDescription.tsx';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';

import { type ArbitraryTransactionsTableItem } from './ArbitraryTransactionsTable.tsx';
import { MSG } from './translation.ts';

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
  ArbitraryTransactionsTableItem,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<ArbitraryTransactionsTableItem>(),
    [],
  );
  const isTablet = useTablet();

  const columns: ColumnDef<ArbitraryTransactionsTableItem, string>[] = useMemo(
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

          const abi = transaction.action.metadata?.arbitraryTxAbis?.find(
            (abiItem) =>
              abiItem.contractAddress === transaction.contractAddress,
          );

          if (!abi) {
            return <div>{formatText(MSG.noAbi)}</div>;
          }

          const decodedTx = decodeArbitraryTransaction(
            abi.jsonAbi,
            transaction.encodedFunction,
          );

          if (!decodedTx) {
            return (
              <span className="mb-3 flex flex-col text-md">
                <span className="mb-3 font-medium text-gray-900">
                  {formatText(MSG.transactionByteData)}:
                </span>
                <span className="text-gray-600 break-word">
                  {transaction.encodedFunction}
                </span>
              </span>
            );
          }

          if (decodedTx?.method) {
            data.push({
              name: 'Method',
              value: decodedTx?.method,
            });
          }
          if (decodedTx?.args) {
            decodedTx.args?.forEach(({ name, type, value }) => {
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
