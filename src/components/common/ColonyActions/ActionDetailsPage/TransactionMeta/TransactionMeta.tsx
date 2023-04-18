import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import TimeRelative from '~shared/TimeRelative';
import TransactionLink from '~shared/TransactionLink';
import { DEFAULT_NETWORK_INFO } from '~constants';

import { TransactionStatuses } from '../staticMaps';

import styles from './TransactionMeta.css';

const displayName = `common.ColonyActions.ActionsPage.TransactionMeta`;

const MSG = defineMessages({
  blockExplorer: {
    id: `${displayName}.blockExplorer`,
    defaultMessage: '{blockExplorerName}',
  },
  transactionStatus: {
    id: `${displayName}.transactionStatus`,
    defaultMessage: `Transaction {status, select,
        failed {failed}
        pending {is pending...}
        other {status is unknown}
      }`,
  },
});

export interface TransactionMetaProps {
  createdAt?: number | Date | string;
  transactionHash?: string;
  status?: TransactionStatuses;
}

const TransactionMeta = ({ createdAt, transactionHash, status }: TransactionMetaProps) => (
  <ul className={styles.main}>
    {createdAt && (
      <li className={styles.items}>
        <TimeRelative value={new Date(createdAt)} />
      </li>
    )}
    {transactionHash && (
      <li className={styles.items}>
        <TransactionLink
          className={styles.blockscoutLink}
          hash={transactionHash}
          text={MSG.blockExplorer}
          textValues={{
            blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
          }}
        />
      </li>
    )}
    {status && status !== TransactionStatuses.Succeeded && (
      <li className={styles.items}>
        <FormattedMessage {...MSG.transactionStatus} values={{ status }} />
      </li>
    )}
  </ul>
);

TransactionMeta.displayName = displayName;

export default TransactionMeta;
