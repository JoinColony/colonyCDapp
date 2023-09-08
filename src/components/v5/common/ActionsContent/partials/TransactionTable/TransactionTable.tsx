import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import useToggle from '~hooks/useToggle';
import { useColonyContext } from '~hooks';
import { useTransactionTable } from './hooks';
import Table from '~v5/common/Table';
import { TransactionTableProps } from './types';

const displayName = 'v5.common.ActionsContent.partials.TransactionTable';

const TransactionTable: FC = () => {
  const { colony } = useColonyContext();
  const { columns } = useTransactionTable();
  const { nativeToken } = colony || {};
  const [
    isTransactionMenuVisible,
    { toggle: toggleTransactionMenu, toggleOff: toggleOffTransactionMenu },
  ] = useToggle();

  return (
    <div className="mt-7">
      <Table<TransactionTableProps>
        className="mt-7"
        tableTitle={{ id: 'actionSidebar.additionalPayments' }}
        columns={columns}
        isMenuVisible={isTransactionMenuVisible}
        onToogle={toggleTransactionMenu}
        onToogleOff={toggleOffTransactionMenu}
        action={{
          type: 'payments',
          actionText: <FormattedMessage id="button.addTransaction" />,
          actionData: {
            amount: '0',
            key: uuidv4(),
            recipent: '',
            token: nativeToken?.tokenAddress || '',
          },
        }}
      />
    </div>
  );
};

TransactionTable.displayName = displayName;

export default TransactionTable;
