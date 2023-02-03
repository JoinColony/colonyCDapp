import React from 'react';

import { TransactionMeta, Status } from '~common/ColonyActions/ActionsPage';

import Hash from './Hash';

import styles from './TransactionHash.css';

const displayName = 'common.ColonyActions.ActionsPage.TransactionHash';

interface Props {
  transactionHash?: string;
  status?: Status;
  showMeta?: boolean;
  createdAt?: number;
}

const TransactionHash = ({
  transactionHash,
  status,
  showMeta = true,
  createdAt = Date.now(),
}: Props) => (
  <div className={styles.main}>
    <div className={styles.transaction}>
      <Hash transactionHash={transactionHash} status={status} />
      {showMeta && (
        <TransactionMeta
          transactionHash={transactionHash}
          createdAt={createdAt}
          status={status}
        />
      )}
    </div>
  </div>
);

TransactionHash.displayName = displayName;

export default TransactionHash;
