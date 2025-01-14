import { Check, SpinnerGap } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useMemo, type FC, useState, useEffect } from 'react';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { TransactionStatus } from '~gql';
import { useMobile } from '~hooks/index.ts';
import {
  useGroupedTransactions,
  getGroupStatus,
} from '~state/transactionState.ts';
import { formatText } from '~utils/intl.ts';
import { noop } from '~utils/noop.ts';

import IconButton from '../Button/IconButton.tsx';

interface Props {
  onClick: () => void;
}

const displayName = 'v5.TxButton';

const TxButton: FC<Props> = ({ onClick }) => {
  const isMobile = useMobile();
  const { isDarkMode } = usePageThemeContext();

  const { transactions } = useGroupedTransactions();

  // This will calculate the following from all transaction groups:
  // Total number of succeeded txs within pending groups / total number of txs in pending groups
  // Returns a tupel [succeeded txs, all txs]
  const succeededTransactionsCount = useMemo(() => {
    if (!transactions.length) {
      return null;
    }
    return transactions
      .filter(
        (txGroup) => getGroupStatus(txGroup) === TransactionStatus.Pending,
      )
      .reduce(
        (acc, txGroup) => {
          txGroup.forEach((tx) => {
            if (tx.status === TransactionStatus.Succeeded) {
              acc[0] += 1;
            }
            acc[1] += 1;
          });
          return acc;
        },
        [0, 0],
      );
  }, [transactions]);

  const groupStatus = useMemo(() => {
    if (
      transactions &&
      transactions.some((txGroup) => {
        const status = getGroupStatus(txGroup);
        if (status === TransactionStatus.Pending) {
          return true;
        }
        return false;
      })
    ) {
      return TransactionStatus.Pending;
    }
    if (
      transactions &&
      transactions[0] &&
      getGroupStatus(transactions[0]) === TransactionStatus.Succeeded
    ) {
      return TransactionStatus.Succeeded;
    }
    return TransactionStatus.Ready;
  }, [transactions]);

  const [showCompleted, setShowCompleted] = useState(false);
  const [showPending, setShowPending] = useState(false);
  // Shows the "Completed" messasge just a little longer after all transactions are completed
  useEffect(() => {
    if (groupStatus === TransactionStatus.Pending) {
      setShowPending(true);
    } else if (groupStatus === TransactionStatus.Succeeded && showPending) {
      setShowPending(false);
      setShowCompleted(true);
      const timeoutId = setTimeout(() => {
        setShowCompleted(false);
      }, 5000);
      return () => {
        if (!(groupStatus === TransactionStatus.Succeeded && showPending)) {
          clearTimeout(timeoutId);
        }
      };
    } else {
      setShowPending(false);
    }
    return noop;
  }, [groupStatus, showPending]);

  if (showPending) {
    return (
      <IconButton
        title={{ id: 'button.pending' }}
        ariaLabel={{ id: 'button.pending' }}
        isFullSize={isMobile}
        className={clsx({
          '!min-w-0': isMobile,
        })}
        icon={
          <span
            className={clsx('flex shrink-0', {
              'ml-1.5': !isMobile,
            })}
          >
            <SpinnerGap className="animate-spin" size={14} />
          </span>
        }
        onClick={onClick}
      >
        {isMobile ? undefined : (
          <span>
            {formatText({ id: 'button.pending' })}
            {succeededTransactionsCount?.[1] &&
            succeededTransactionsCount[1] > 1
              ? ` ${succeededTransactionsCount[0]}/${succeededTransactionsCount[1]}`
              : null}
          </span>
        )}
      </IconButton>
    );
  }

  if (showCompleted) {
    return (
      <IconButton
        title={{ id: 'button.completed' }}
        ariaLabel={{ id: 'button.completed' }}
        isFullSize={isMobile}
        text={isMobile ? undefined : { id: 'button.completed' }}
        className={clsx({
          '!min-w-0': isMobile,
        })}
        icon={
          <span
            className={clsx('flex shrink-0', {
              'ml-1.5': !isMobile,
            })}
          >
            <Check
              className={clsx({
                'text-base-white': !isDarkMode,
                'text-gray-900': isDarkMode,
              })}
              size={14}
            />
          </span>
        }
        onClick={onClick}
      />
    );
  }

  return null;
};

TxButton.displayName = displayName;

export default TxButton;
