import { Check, SpinnerGap } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useMemo, type FC, useState, useEffect } from 'react';

import { TransactionStatus } from '~gql';
import { useMobile } from '~hooks/index.ts';
import usePrevious from '~hooks/usePrevious.ts';
import {
  TransactionGroupStatus,
  useGroupedTransactions,
  getGroupStatus,
} from '~state/transactionState.ts';
import { formatText } from '~utils/intl.ts';

import IconButton from '../Button/IconButton.tsx';

const displayName = 'v5.TxButton';

const TxButton: FC = () => {
  const isMobile = useMobile();

  const { transactions, groupState } = useGroupedTransactions();

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

  const [showCompleted, setShowCompleted] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const prevGroupState = usePrevious(groupState);

  // Shows the "Completed" messasge just a little longer after all transactions are completed
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (groupState === TransactionGroupStatus.Pending) {
      setShowPending(true);
    } else if (
      groupState === TransactionGroupStatus.Done &&
      prevGroupState === TransactionGroupStatus.Pending
    ) {
      setShowPending(false);
      setShowCompleted(true);
      timeoutId = setTimeout(() => {
        setShowCompleted(false);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [groupState, prevGroupState]);

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
            <Check className="text-base-white" size={14} />
          </span>
        }
        data-openhubifclicked
      />
    );
  }

  return null;
};

TxButton.displayName = displayName;

export default TxButton;
