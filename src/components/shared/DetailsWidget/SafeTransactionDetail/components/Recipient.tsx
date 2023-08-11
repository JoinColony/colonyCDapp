import React from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { UserDetail } from '~shared/DetailsWidget';
import { User } from '~types';

import { MSG } from '../../detailsWidgetConfig';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../SafeTransactionDetail.css';

interface RecipientProps {
  recipient: User;
}

export const Recipient = ({ recipient }: RecipientProps) => (
  <div className={classnames(widgetStyles.item, styles.recipient)}>
    <div className={widgetStyles.label}>
      <FormattedMessage {...MSG.toRecipient} />
    </div>
    <div className={widgetStyles.value}>
      <UserDetail walletAddress={recipient?.walletAddress} />
    </div>
  </div>
);
