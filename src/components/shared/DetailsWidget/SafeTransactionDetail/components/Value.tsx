import React from 'react';
import { FormattedMessage } from 'react-intl';

import Numeral from '~shared/Numeral';
import Icon from '~shared/Icon';
import { Token, SafeTransactionData } from '~types';
import TokenIcon from '~shared/TokenIcon';

import { MSG } from '../../detailsWidgetConfig';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../SafeTransactionDetail.css';

const renderTokenIcon = (safeToken: Token) => {
  if (safeToken.name === 'Ether') {
    return <Icon className={styles.ether} name="ether" title="Ether Logo" />;
  }

  return (
    <TokenIcon
      className={styles.tokenAvatar}
      title={`${safeToken.name} token logo`}
      token={safeToken as Token}
    />
  );
};

interface ValueProps {
  transaction: SafeTransactionData;
  token: Token;
}

export const Value = ({ transaction, token }: ValueProps) => (
  <div className={widgetStyles.item}>
    <div className={widgetStyles.label}>
      <FormattedMessage {...MSG.value} />
    </div>
    {token && transaction.amount && (
      <div className={styles.tokenContainer}>
        {renderTokenIcon(token)}
        <div className={widgetStyles.value}>
          <Numeral value={transaction.amount} />
          <span>{token.symbol}</span>
        </div>
      </div>
    )}
  </div>
);
