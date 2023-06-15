import React, { FC } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { TRANSACTION_STATUSES } from '~types';

import Icon from '~shared/Icon';
import { SpinnerLoader } from '~shared/Preloaders';
import { TransactionStatusProps } from '../types';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.TransactionStatus';

const TransactionStatus: FC<TransactionStatusProps> = ({
  status,
  groupCount,
  loadingRelated,
  date,
}) => {
  const ready = status === TRANSACTION_STATUSES.READY;
  const failed = status === TRANSACTION_STATUSES.FAILED;
  const succeeded = status === TRANSACTION_STATUSES.SUCCEEDED;
  const pending = status === TRANSACTION_STATUSES.PENDING;

  const createdAt = date && format(new Date(date ?? 0 * 1000), 'dd MMMM yyyy');

  return (
    <div
      className={clsx('flex flex-col items-end', {
        'text-success-400': succeeded || ready,
        'text-negative-400': failed,
      })}
    >
      {/* @TOOD: when it should appear? */}
      {/* {hash && (
      <TransactionLink
        className={styles.interaction}
        hash={hash}
        text={MSG.transactionBlockExplorer}
        textValues={{
          blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
        }}
      />
    )} */}

      {/* @TOOD: when it should appear? */}
      {groupCount && ready && (
        <span>
          <span>{groupCount}</span>
        </span>
      )}

      {(pending || loadingRelated) && (
        <div data-test="gasStationTransactionPending">
          <SpinnerLoader appearance={{ size: 'small', theme: 'primary' }} />
        </div>
      )}
      <Icon
        name={succeeded || ready ? 'check-circle' : 'x-circle'}
        appearance={{ size: 'tiny' }}
      />
      {createdAt && (
        <span className="text-gray-400 text-xs block mt-1">{createdAt}</span>
      )}
    </div>
  );
};

TransactionStatus.displayName = displayName;

export default TransactionStatus;
