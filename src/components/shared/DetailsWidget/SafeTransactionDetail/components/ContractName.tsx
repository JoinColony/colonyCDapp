import React from 'react';
import classnames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';

import Avatar from '~shared/Avatar';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../SafeTransactionDetail.css';

const displayName = 'DetailsWidget.SafeTransactionDetail.ContractName';

const MSG = defineMessages({
  contractName: {
    id: `${displayName}.ContractName`,
    defaultMessage: 'Contract name',
  },
});

interface ContractNameProps {
  name: string;
  address: string;
  showMaskedAddress?: boolean;
}

export const ContractName = ({ name, address }: ContractNameProps) => (
  <div className={classnames(widgetStyles.item, styles.contractItem)}>
    <div className={widgetStyles.label}>
      <FormattedMessage {...MSG.contractName} />
    </div>
    <div className={widgetStyles.value}>
      <Avatar
        seed={address.toLowerCase()}
        title="Contract Avatar"
        placeholderIcon="gnosis-logo"
      />
      <div className={styles.contractAddress}>
        <span>{name}</span>
      </div>
    </div>
  </div>
);
