import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { isAddress } from 'ethers/lib/utils';
import React, { useMemo } from 'react';

import { useMobile } from '~hooks/index.ts';
import getMaskedAddress from '~shared/MaskedAddress/getMaskedAddress.ts';
import { formatText } from '~utils/intl.ts';
import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';
import { makeMenuColumn } from '~v5/common/Table/utils.tsx';
import Button from '~v5/shared/Button/Button.tsx';
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

export const useArbitraryTxsTableColumns = ({
  openTransactionModal,
  isError,
  hasNoDecisionMethods,
  getMenuProps,
}): ColumnDef<AddTransactionTableModel, string>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<AddTransactionTableModel>(),
    [],
  );
  const isMobile = useMobile();

  const menuColumn = useMemo(
    () =>
      getMenuProps
        ? makeMenuColumn({
            helper: columnHelper,
            getMenuProps,
            cellProps: {
              staticSize: isMobile ? '60px' : '10%',
            },
          })
        : null,
    [getMenuProps, columnHelper, isMobile],
  );

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
          if (!address) {
            return (
              <Button
                type="button"
                onClick={openTransactionModal}
                mode="link"
                disabled={hasNoDecisionMethods}
                className={clsx(
                  'text-gray-400 no-underline md:hover:text-blue-400',
                  {
                    'text-negative-400': isError,
                  },
                )}
              >
                {formatText({ id: 'button.addTransaction' })}
              </Button>
            );
          }
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
        cell: ({ row: { original } }) => {
          const data: CellDescriptionItem[] = [];
          if (original?.method) {
            data.push({
              name: 'Method',
              value: original?.method,
            });
          }
          if (original?.args) {
            original.args?.forEach(({ name, type, value }) => {
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
    [
      columnHelper,
      isMobile,
      hasNoDecisionMethods,
      openTransactionModal,
      isError,
    ],
  );

  return menuColumn ? [...columns, menuColumn] : columns;
};
