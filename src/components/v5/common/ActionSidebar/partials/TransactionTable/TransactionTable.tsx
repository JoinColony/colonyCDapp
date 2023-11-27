import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';

import Button from '~v5/shared/Button/Button';
import { useMobile } from '~hooks';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import { useTransactionTableColumns, useGetTableMenuProps } from './hooks';
import { TransactionTableModel, TransactionTableProps } from './types';
import { formatText } from '~utils/intl';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext';

const displayName = 'v5.common.ActionsContent.partials.TransactionTable';

const TransactionTable: FC<TransactionTableProps> = ({
  name,
  tokenAddress,
}) => {
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: TransactionTableModel[] = fieldArrayMethods.fields.map(
    ({ id }) => ({
      key: id,
    }),
  );
  const { readonly } = useAdditionalFormOptionsContext();
  const columns = useTransactionTableColumns(name, tokenAddress);
  const isMobile = useMobile();
  const value = useWatch({ name });
  const getMenuProps = useGetTableMenuProps(
    fieldArrayMethods,
    value,
    !readonly,
  );
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);

  return (
    <div>
      {!!data.length && (
        <>
          <h5 className="text-2 mb-3 mt-6">
            {formatText({ id: 'actionSidebar.additionalPayments' })}
          </h5>
          <TableWithMeatballMenu<TransactionTableModel>
            className={clsx({
              '!border-negative-400': !!fieldState.error,
            })}
            getRowId={({ key }) => key}
            columns={columns}
            data={data}
            getMenuProps={getMenuProps}
          />
        </>
      )}
      {!readonly && (
        <Button
          mode="primaryOutline"
          iconName="plus"
          size="small"
          className="mt-6"
          isFullSize={isMobile}
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
