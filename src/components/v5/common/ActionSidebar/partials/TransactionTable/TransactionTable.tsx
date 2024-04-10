import { CopySimple, Plus, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/index.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { useTransactionTableColumns } from './hooks.tsx';
import {
  type TransactionTableModel,
  type TransactionTableProps,
} from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.TransactionTable';

const TransactionTable: FC<TransactionTableProps> = ({ name }) => {
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: TransactionTableModel[] = fieldArrayMethods.fields.map(
    ({ id }) => ({
      key: id,
    }),
  );
  const { readonly } = useAdditionalFormOptionsContext();
  const columns = useTransactionTableColumns(name);
  const isMobile = useMobile();
  const value = useWatch({ name });
  const getMenuProps = ({ index }) =>
    !readonly
      ? {
          cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
          items: [
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

  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);

  return (
    <div>
      {!!data.length && (
        <>
          <h5 className="mb-3 mt-6 text-2">
            {formatText({ id: 'actionSidebar.additionalPayments' })}
          </h5>
          <Table<TransactionTableModel>
            className={clsx({
              '!border-negative-400': !!fieldState.error,
            })}
            getRowId={({ key }) => key}
            columns={columns}
            data={data}
            getMenuProps={getMenuProps}
            verticalLayout={isMobile}
          />
        </>
      )}
      {!readonly && (
        <Button
          mode="primaryOutline"
          icon={Plus}
          size="small"
          className="mt-6 w-full sm:w-auto"
          onClick={() => {
            fieldArrayMethods.append({
              amount: {
                // amount: '0', // Disable default value
              },
            });
          }}
        >
          <FormattedMessage id="button.addTransaction" />
        </Button>
      )}
    </div>
  );
};

TransactionTable.displayName = displayName;

export default TransactionTable;
