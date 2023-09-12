import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useColonyContext, useMobile } from '~hooks';
import { useTransactionTable } from './hooks';
import TableWithBurgerMenu from '~v5/common/TableWithBurgerMenu';
import { TransactionTableProps } from './types';
import Button from '~v5/shared/Button';

const displayName = 'v5.common.ActionsContent.partials.TransactionTable';

const TransactionTable: FC = () => {
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { columns } = useTransactionTable();
  const { nativeToken } = colony || {};
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'payments',
  });

  return (
    <div className="mt-7">
      {!!fields?.length && (
        <TableWithBurgerMenu<TransactionTableProps>
          className="mt-7"
          tableTitle={
            <FormattedMessage id="actionSidebar.additionalPayments" />
          }
          columns={columns}
          actions={{
            fields,
            append,
            remove,
            getValues,
          }}
        />
      )}
      <Button
        mode="primaryOutline"
        iconName="plus"
        size="small"
        className="mt-6"
        isFullSize={isMobile}
        onClick={() => {
          append({
            amount: '0',
            key: uuidv4(),
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
