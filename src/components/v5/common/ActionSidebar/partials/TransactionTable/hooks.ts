import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { TransactionProps } from './types';

export const useTransactionTable = () => {
  const { unregister } = useFormContext();
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);

  const handleRemoveRowClick = (id: number) => {
    setTransactions(transactions.filter((item) => item.key !== id));
    unregister(`transaction-amount-${id}`);
    unregister(`transaction-recipent-${id}`);
  };

  const handleDuplicateRowClick = (id: number) => {
    const transaction = transactions.find((item) => item.key === id);

    if (transaction) {
      setTransactions([
        ...transactions,
        {
          ...transaction,
          key: uuidv4(),
        },
      ]);
    }
  };

  const updateTransaction = useCallback(
    (key: number, values: TransactionProps) => {
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

  return {
    transactions,
    handleRemoveRowClick,
    handleDuplicateRowClick,
    updateTransaction,
    setTransactions,
  };
};
