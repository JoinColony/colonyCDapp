import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import { TransactionStatus, TransactionStatuses } from '~common/ColonyActions';

import styles from './TransactionHash.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.TransactionNotFound.Hash';

const MSG = defineMessages({
  fallbackTitle: {
    id: `${displayName}.fallbackTitle`,
    defaultMessage: 'Transaction hash',
  },
});

interface Props {
  status?: TransactionStatuses;
  transactionHash?: string;
  title?: MessageDescriptor;
}

const Hash = ({ transactionHash, title = MSG.fallbackTitle, status }: Props) =>
  transactionHash ? (
    <>
      <p className={styles.title}>
        {status && <TransactionStatus status={status} />}
        <FormattedMessage {...title} />
      </p>
      <div className={styles.transactionHash}>{transactionHash}</div>
    </>
  ) : null;

Hash.displayName = displayName;

export default Hash;
