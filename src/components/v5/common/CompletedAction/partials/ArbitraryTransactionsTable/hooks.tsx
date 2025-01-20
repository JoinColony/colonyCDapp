import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { isAddress } from 'ethers/lib/utils';
import React, { useMemo } from 'react';

import { useMobile } from '~hooks/index.ts';
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
  const isMobile = useMobile();

  const columns: ColumnDef<ArbitraryTransactionsTableItem, string>[] = useMemo(
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
        staticSize: isMobile ? '100px' : '30%',
      }),
      columnHelper.display({
        id: 'description',
        header: () => (
          <span className="text-sm text-gray-600">
            {formatText({ id: 'table.row.details' })}
          </span>
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
              <span className="mb-3 flex flex-col">
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
                  isFull: !isMobile,
                }),
              });
            });
          }
          return <CellDescription data={data} />;
        },
        staticSize: isMobile ? '100px' : '67%',
      }),
    ],
    [columnHelper, isMobile],
  );

  return columns;
};
