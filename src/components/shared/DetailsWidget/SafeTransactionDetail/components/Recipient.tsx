import React from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { User, Colony } from '~types';
import { UserDetail } from '~shared/DetailsWidget';

import { MSG } from '../../detailsWidgetConfig';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../SafeTransactionDetail.css';

interface RecipientProps {
  recipient: User;
  colony: Colony;
}

export const Recipient = ({
  /* colony, */
  recipient,
}: RecipientProps) => (
  <div className={classnames(widgetStyles.item, styles.recipient)}>
    <div className={widgetStyles.label}>
      <FormattedMessage {...MSG.toRecipient} />
    </div>
    <div className={widgetStyles.value}>
      <UserDetail
        /* colony={colony} */
        walletAddress={recipient?.walletAddress}
      />
    </div>
  </div>
);
