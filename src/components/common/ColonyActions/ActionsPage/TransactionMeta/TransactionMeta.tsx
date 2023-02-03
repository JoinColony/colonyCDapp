import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import TimeRelative from '~shared/TimeRelative';
import TransactionLink from '~shared/TransactionLink';
import { DEFAULT_NETWORK_INFO } from '~constants';

import { Status } from '../index';

import styles from './TransactionMeta.css';

const displayName = `common.colonyActions.ActionsPage.TransactionMeta`;

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

interface Props {
  createdAt?: number | Date;
  transactionHash?: string;
  status?: Status;
}

const TransactionMeta = ({ createdAt, transactionHash, status }: Props) => (
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
    {status && status !== Status.Succeeded && (
      <li className={styles.items}>
        <FormattedMessage {...MSG.transactionStatus} values={{ status }} />
      </li>
    )}
  </ul>
);

TransactionMeta.displayName = displayName;

export default TransactionMeta;
