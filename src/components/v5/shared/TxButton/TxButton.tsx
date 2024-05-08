import { Check, SpinnerGap } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useMemo, type FC, useState, useEffect } from 'react';

import { TransactionStatus } from '~gql';
import { useMobile } from '~hooks/index.ts';
import usePrevious from '~hooks/usePrevious.ts';
import { formatText } from '~utils/intl.ts';

import {
  TransactionGroupStatus,
  useGroupedTransactions,
} from '../../../../state/transactionState.ts';
import IconButton from '../Button/IconButton.tsx';

const displayName = 'v5.TxButton';

const TxButton: FC = () => {
  const isMobile = useMobile();

  const { transactions, groupState } = useGroupedTransactions();

  const succeededTransactionsCount = useMemo(
    () =>
      transactions.length &&
      transactions[0]?.reduce((acc, tx) => {
        if (tx.status === TransactionStatus.Succeeded) {
          return acc + 1;
        }
        return acc;
      }, 0),
    [transactions],
  );

  const [showCompleted, setShowCompleted] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const prevGroupState = usePrevious(groupState);

  // Does two things:
  // - Shows the "Completed" messasge just a little longer after all transactions are completed
  // - Shows the "Pending" message after one transaction but before the next to "bridge the gap"
  useEffect(() => {
    if (
      groupState === TransactionGroupStatus.AllCompleted &&
      prevGroupState === TransactionGroupStatus.SomePending
    ) {
      setShowPending(false);
      setShowCompleted(true);
      setTimeout(() => {
        setShowCompleted(false);
      }, 5000);
    } else if (
      groupState === TransactionGroupStatus.SomePending ||
      groupState === TransactionGroupStatus.NonePending
    ) {
      setShowCompleted(false);
      setShowPending(true);
    }
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
        data-openhubifclicked // see UserReputation for usage
      >
        {isMobile ? undefined : (
          <span>
            {formatText({ id: 'button.pending' })}{' '}
            {transactions[0] &&
              transactions[0].length > 1 &&
              `${succeededTransactionsCount}/${transactions[0].length}`}
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
        data-openhubifclicked // see UserReputation for usage
      />
    );
  }

  return null;
};

TxButton.displayName = displayName;

export default TxButton;
