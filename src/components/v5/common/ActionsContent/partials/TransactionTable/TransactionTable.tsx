import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { useFieldArray, useWatch } from 'react-hook-form';

import Button from '~v5/shared/Button/Button';
import { useColonyContext, useMobile } from '~hooks';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import { useTransactionTableColumns, useGetTableMenuProps } from './hooks';
import { TransactionTableModel, TransactionTableProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.TransactionTable';

const TransactionTable: FC<TransactionTableProps> = ({ name }) => {
  const { nativeToken } = useColonyContext().colony || {};
  const fieldArrayMethods = useFieldArray({
    name,
  });
  const data: TransactionTableModel[] = useWatch({ name }) || [];
  const columns = useTransactionTableColumns(name);
  const isMobile = useMobile();
  const getMenuProps = useGetTableMenuProps(fieldArrayMethods);

  return (
    <div className="mt-7">
      {!!data.length && (
        <TableWithMeatballMenu<TransactionTableModel>
          className="mt-7"
          getRowId={({ key }) => key}
          columns={columns}
          data={data}
          getMenuProps={getMenuProps}
          title={<FormattedMessage id="actionSidebar.additionalPayments" />}
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
            key: uuidv4(),
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
