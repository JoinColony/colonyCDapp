import React, { FC, useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import Button from '~v5/shared/Button/Button';
import { TransactionProps } from './types';
import { useColonyContext } from '~hooks';
import styles from './TransactionTable.module.css';
import TransactionItem from '../TransactionItem';

const TransactionTable: FC = () => {
  const { formatMessage } = useIntl();
  const { colony } = useColonyContext();
  const { unregister } = useFormContext();
  const { nativeToken } = colony || {};

  const [transactions, setTransactions] = useState<TransactionProps[]>([]);

  const handleRemoveRowClick = (id: string) => {
    setTransactions(transactions.filter((item) => item.key !== id));
    unregister(`transaction-amount-${id}`);
    unregister(`transaction-recipent-${id}`);
  };

  const handleDuplicateRowClick = (id: string) => {
    const transaction = transactions.find((item) => item.key === id);

    if (transaction) {
      setTransactions([
        ...transactions,
        {
          ...transaction,
          key: `${transactions.length + 1}`,
        },
      ]);
    }
  };

  const updateTransaction = useCallback(
    (key: string, values: TransactionProps) => {
      const updatedTransactions = transactions.map((transaction) => {
        if (transaction.key === key) {
          return {
            ...transaction,
            ...values,
          };
        }

        return transaction;
      });

      setTransactions(updatedTransactions);
    },
    [transactions],
  );

  return (
    <div className="mt-7">
      {transactions.length > 0 && (
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
        text={{ id: 'button.addTransaction' }}
        onClick={() => {
          setTransactions([
            ...transactions,
            {
              amount: '0',
              // @TODO: Find better way to get the key - because when removing a row, the key is not updated and it might be duplicated
              key: `${transactions.length + 1}`,
              recipent: '',
              token: nativeToken?.tokenAddress || '',
            },
          ]);
        }}
      />
    </div>
  );
};

export default TransactionTable;
