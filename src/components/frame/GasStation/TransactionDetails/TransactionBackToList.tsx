import React, { MouseEvent } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~shared/Icon';

import styles from './TransactionBackToList.css';

const displayName = 'frame.GasStation.TransactionBackToList';

const MSG = defineMessages({
  returnToSummary: {
    id: `${displayName}.returnToSummary`,
    defaultMessage: 'See all pending actions',
  },
});

interface Props {
  onClose: (event: MouseEvent) => void;
}

const TransactionBackToList = ({ onClose }: Props) => (
  <button type="button" className={styles.returnToSummary} onClick={onClose}>
    <Icon appearance={{ size: 'normal' }} name="caret-left" title={MSG.returnToSummary} />
    <FormattedMessage {...MSG.returnToSummary} />
  </button>
);

TransactionBackToList.displayName = displayName;

export default TransactionBackToList;
