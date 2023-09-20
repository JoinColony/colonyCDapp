import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import Button from '~v5/shared/Button/Button';
import { useColonyContext, useMobile } from '~hooks';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import { useTransactionTableColumns, useGetTableMenuProps } from './hooks';
import { TransactionTableModel, TransactionTableProps } from './types';
import { formatText } from '~utils/intl';

const displayName = 'v5.common.ActionsContent.partials.TransactionTable';

const TransactionTable: FC<TransactionTableProps> = ({ name }) => {
  const { nativeToken } = useColonyContext().colony || {};
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: TransactionTableModel[] = fieldArrayMethods.fields.map(
    ({ id }) => ({
      key: id,
    }),
  );
  const columns = useTransactionTableColumns(name);
  const isMobile = useMobile();
  const value = useWatch({ name });
  const getMenuProps = useGetTableMenuProps(fieldArrayMethods, value);
  const { getFieldState } = useFormContext();
  const fieldState = getFieldState(name);

  return (
    <div className="mt-7">
      {!!data.length && (
        <TableWithMeatballMenu<TransactionTableModel>
          tableClassName={fieldState.error && 'border-red-400'}
          getRowId={({ key }) => key}
          columns={columns}
          data={data}
          getMenuProps={getMenuProps}
          title={formatText({ id: 'actionSidebar.additionalPayments' })}
        />
      )}
      <Button
        mode="primaryOutline"
        iconName="plus"
        size="small"
        className="mt-6"
        isFullSize={isMobile}
        onClick={() => {
          fieldArrayMethods.append({
            amount: '0',
            recipent: '',
            token: nativeToken?.tokenAddress || '',
          });
        }}
      >
        <FormattedMessage id="button.addTransaction" />
      </Button>
    </div>
  );
};

TransactionTable.displayName = displayName;

export default TransactionTable;
