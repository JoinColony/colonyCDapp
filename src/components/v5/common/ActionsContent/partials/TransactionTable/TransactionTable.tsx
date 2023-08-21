import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import Button from '~v5/shared/Button/Button';
import { useColonyContext } from '~hooks';
import styles from './TransactionTable.module.css';
import TransactionItem from '../TransactionItem';
import { useTransactionTable } from './hooks';

const displayName = 'v5.common.ActionsContent.partials.TransactionTable';

const TransactionTable: FC = () => {
  const { formatMessage } = useIntl();
  const { colony } = useColonyContext();
  const {
    transactions,
    handleRemoveRowClick,
    handleDuplicateRowClick,
    updateTransaction,
    setTransactions,
  } = useTransactionTable();

  const { nativeToken } = colony || {};

  return (
    <div className="mt-7">
      {!!transactions.length && (
        <div className="mb-6">
          <h5 className="text-2 mb-3">
            {formatMessage({ id: 'actionSidebar.additionalPayments' })}
          </h5>
          <div className="border border-gray-200 rounded-lg">
            <div className={styles.tableHead}>
              <span className="w-1/3">Recipent</span>
              <span className="w-2/3">Amount</span>
            </div>
            <div>
              {transactions.map((transaction) => (
                <TransactionItem
                  {...transaction}
                  key={transaction.key}
                  id={transaction.key}
                  onRemoveClick={handleRemoveRowClick}
                  onDuplicateClick={handleDuplicateRowClick}
                  onUpdate={updateTransaction}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <Button
        mode="primaryOutline"
        iconName="plus"
        size="small"
        text={{ id: 'button.addTransaction' }}
        onClick={() => {
          setTransactions([
            ...transactions,
            {
              amount: '0',
              key: uuidv4(),
              recipent: '',
              token: nativeToken?.tokenAddress || '',
            },
          ]);
        }}
      />
    </div>
  );
};

TransactionTable.displayName = displayName;

export default TransactionTable;
