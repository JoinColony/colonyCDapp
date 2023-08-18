import { useCallback, useState } from 'react';
import { TransactionProps } from './types';
import { useFormContext } from 'react-hook-form';

export const useTransactionTable = () => {
  const { unregister } = useFormContext();
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

  return {
    transactions,
    handleRemoveRowClick,
    handleDuplicateRowClick,
    updateTransaction,
    setTransactions,
  };
};
