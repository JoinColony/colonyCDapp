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
  isFormDisabled,
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
          <div className="pt-1.5 text-sm text-gray-600 sm:pt-0">
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
          if (!address) {
            return (
              <div className="pt-1">
                <Button
                  type="button"
                  onClick={openTransactionModal}
                  mode="link"
                  disabled={hasNoDecisionMethods || isFormDisabled}
                  className={clsx(
                    'text-gray-400 no-underline md:hover:text-blue-400',
                    {
                      'text-negative-400': isError,
                      '!text-gray-300': isFormDisabled,
                    },
                  )}
                >
                  {formatText({ id: 'button.addTransaction' })}
                </Button>
              </div>
            );
          }
          return (
            <span className="flex max-w-full items-center gap-2 pt-1">
              {isAddressValid && <UserAvatar userAddress={address} size={20} />}

              <span className="truncate text-md font-medium text-gray-900">
                {maskedAddress.result}
              </span>
            </span>
          );
        },
        staticSize: isMobile ? '97px' : '35%',
      }),
      columnHelper.display({
        id: 'description',
        header: () => (
          <div className="pt-1.5 text-sm text-gray-600 sm:pt-0">
            {formatText({ id: 'table.row.details' })}
          </div>
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
        staticSize: isMobile ? '97px' : '67%',
      }),
    ],
    [
      columnHelper,
      isMobile,
      hasNoDecisionMethods,
      openTransactionModal,
      isError,
      isFormDisabled,
    ],
  );

  return menuColumn ? [...columns, menuColumn] : columns;
};
