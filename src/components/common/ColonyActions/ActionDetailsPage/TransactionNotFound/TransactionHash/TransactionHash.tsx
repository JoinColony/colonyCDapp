import React from 'react';

import {
  TransactionMeta,
  TransactionMetaProps,
  TransactionStatuses,
} from '~common/ColonyActions';

import Hash from './Hash';

import styles from './TransactionHash.css';

const displayName = 'common.ColonyActions.ActionDetailsPage.TransactionHash';

interface Props {
  transactionHash?: string;
  status?: TransactionStatuses;
  showMeta?: boolean;
  createdAt?: TransactionMetaProps['createdAt'];
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
