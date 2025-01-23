import { CopySimple, Plus, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/Table/consts.ts';
import { Table } from '~v5/common/Table/Table.tsx';
import { getMoreActionsMenu } from '~v5/common/Table/utils.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import AddTransactionModal from '../AddTransactionModal/AddTransactionModal.tsx';

import { useArbitraryTxsTableColumns } from './hooks.tsx';
import { MSG, displayName } from './translation.ts';

interface ArbitraryTransactionsTableProps {
  name: string;
}

const ArbitraryTransactionsTable: FC<ArbitraryTransactionsTableProps> = ({
  name,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMobile = useMobile();
  const fieldArrayMethods = useFieldArray({ name });
  const value = useWatch({ name });
  const { readonly } = useAdditionalFormOptionsContext();
  const hasNoDecisionMethods = useHasNoDecisionMethods();
  const [defaultValues, setDefaultValues] = useState(
    {} as AddTransactionTableModel,
  );
  const openTransactionModal = () => {
    setIsModalOpen(true);
  };
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);

  const closeTransactionModal = () => {
    setDefaultValues({} as AddTransactionTableModel);
    setIsModalOpen(false);
  };
  const data: AddTransactionTableModel[] = fieldArrayMethods.fields.map(
    ({ id }, index) => ({
      key: id,
      ...(value?.[index] || {}),
    }),
  );

  const getMenuProps = ({ index, original: rowValues }) =>
    !readonly && data.length > 0
      ? {
          cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
          items: [
            {
              key: 'edit',
              onClick: () => {
                setDefaultValues(rowValues as AddTransactionTableModel);
                setIsModalOpen(true);
              },
              label: formatText(MSG.contractTableEditRow),
              icon: CopySimple,
            },
            {
              key: 'duplicate',
              onClick: () =>
                fieldArrayMethods.insert(index + 1, {
                  ...value[index],
                }),
              label: formatText({ id: 'table.row.duplicate' }),
              icon: CopySimple,
            },
            {
              key: 'remove',
              onClick: () => fieldArrayMethods.remove(index),
              label: formatText({ id: 'table.row.remove' }),
              icon: Trash,
            },
          ],
        }
      : undefined;

  const columns = useArbitraryTxsTableColumns({
    openTransactionModal,
    isError: !!fieldState.error,
    hasNoDecisionMethods,
    getMenuProps,
  });

  return (
    <div className="pt-4">
      <h5 className="mb-4 text-2">
        {formatText({ id: 'actionSidebar.transactions' })}
      </h5>
      <Table<AddTransactionTableModel>
        overrides={{
          getRowId: ({ key }) => key,
          state: {
            columnVisibility: {
              [MEATBALL_MENU_COLUMN_ID]: !isMobile,
            },
          },
        }}
        layout={isMobile ? 'vertical' : 'horizontal'}
        className={clsx('mb-6', {
          '!border-negative-400 md:[&_tfoot_td]:!border-negative-400 md:[&_th]:border-negative-400':
            !!fieldState.error,
        })}
        columns={columns}
        data={data.length === 0 ? [{} as AddTransactionTableModel] : data}
        moreActions={getMoreActionsMenu({
          getMenuProps,
          visible: isMobile,
        })}
      />
      {!readonly && (
        <>
          <Button
            mode="primaryOutline"
            icon={Plus}
            size="small"
            isFullSize={isMobile}
            onClick={openTransactionModal}
            disabled={hasNoDecisionMethods}
          >
            {formatText({ id: 'button.addTransaction' })}
          </Button>

          <AddTransactionModal
            onClose={closeTransactionModal}
            isOpen={isModalOpen}
            defaultValues={defaultValues}
            onSubmit={({
              jsonAbi,
              contractAddress,
              method,
              args = [],
              key,
            }) => {
              const newItem = {
                jsonAbi,
                contractAddress,
                method,
                args,
              };

              if (key) {
                const index = fieldArrayMethods.fields.findIndex(
                  (field) => field.id === key,
                );
                if (index !== -1) {
                  fieldArrayMethods.update(index, newItem);
                } else {
                  console.warn(
                    `Item with key ${key} not found. Adding as new item.`,
                  );
                  fieldArrayMethods.append(newItem);
                }
              } else {
                fieldArrayMethods.append(newItem);
              }

              closeTransactionModal();
            }}
          />
        </>
      )}
    </div>
  );
};

ArbitraryTransactionsTable.displayName = displayName;

export default ArbitraryTransactionsTable;
