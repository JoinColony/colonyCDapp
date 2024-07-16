import { Plus, Trash, X } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useEffect, type FC } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useTablet } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/index.ts';
import { TokenStatus } from '~v5/common/types.ts';
import Button from '~v5/shared/Button/index.ts';

import { useTokensTableColumns } from './hooks.tsx';
import { type TokensTableModel, type TokensTableProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.TokensTable';

const TokensTable: FC<TokensTableProps> = ({
  name,
  shouldShowMenu = () => true,
  isDisabled,
}) => {
  const isTablet = useTablet();
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: TokensTableModel[] = fieldArrayMethods.fields.map(({ id }) => ({
    key: id,
  }));
  const { getFieldState, trigger } = useFormContext();
  const fieldState = getFieldState(name);
  const selectedTokenAddresses = useWatch({ name });
  const value = useWatch({ name }) || [];
  const columns = useTokensTableColumns(name, value);
  const getMenuProps = ({ index }) => {
    const shouldShow = shouldShowMenu(value[index]?.status);

    const editPreviouslyAddedToken = [
      TokenStatus.Unaffected,
      TokenStatus.Removed,
    ].includes(value[index]?.status);

    const hasRemovedLabel = value[index]?.status === TokenStatus.Removed;

    return shouldShow && !isDisabled
      ? {
          cardClassName: 'sm:min-w-[9.625rem]',
          items: [
            {
              key: 'remove',
              onClick: () =>
                editPreviouslyAddedToken
                  ? fieldArrayMethods.update(index, {
                      ...value[index],
                      status: hasRemovedLabel
                        ? TokenStatus.Unaffected
                        : TokenStatus.Removed,
                    })
                  : fieldArrayMethods.remove(index),
              label: formatText({
                id: hasRemovedLabel ? 'table.row.cancel' : 'table.row.remove',
              }),
              icon: hasRemovedLabel ? X : Trash,
            },
          ],
        }
      : undefined;
  };

  // Added to trigger validation on token change to check for duplicates in previous fields
  useEffect(() => {
    if (!selectedTokenAddresses?.length) {
      return;
    }

    selectedTokenAddresses.forEach(({ token }, index) => {
      if (!token) {
        return;
      }

      trigger(`${name}.${index}.token`);
    });
  }, [name, selectedTokenAddresses, trigger]);

  return (
    <div className="mt-6">
      <h5 className="mb-3 text-md font-semibold text-gray-900">
        {formatText({ id: 'actionSidebar.approvedTokens' })}
      </h5>
      {!!data.length && (
        <Table<TokensTableModel>
          className={clsx('mb-6', {
            '!border-negative-400': !!fieldState.error,
            '[&_tbody_td]:h-[3.375rem] [&_td:first-child]:pl-4 [&_td:nth-child(2)]:pr-2 [&_td]:pr-4 [&_th:first-child]:pl-4 [&_th:not(:first-child)]:pl-0 [&_th]:pr-4':
              !isTablet,
            '[&_table]:table-auto': isTablet,
          })}
          getRowId={({ key }) => key}
          columns={columns}
          data={data}
          getMenuProps={getMenuProps}
          isDisabled={isDisabled}
          verticalLayout={isTablet}
          renderCellWrapper={(_, content) => content}
          withBorder={false}
          meatBallMenuSize={34}
        />
      )}
      <Button
        mode="primaryOutline"
        icon={Plus}
        size="small"
        className="w-full sm:w-auto"
        onClick={() => {
          fieldArrayMethods.append({
            status: TokenStatus.Added,
          });
        }}
        disabled={isDisabled}
      >
        {formatText({ id: 'button.addToken' })}
      </Button>
    </div>
  );
};

TokensTable.displayName = displayName;

export default TokensTable;
