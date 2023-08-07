import React from 'react';
import { FormattedMessage } from 'react-intl';

import Numeral from '~shared/Numeral';
import Avatar from '~shared/Avatar';
import Icon from '~shared/Icon';
import { Token, SafeTransaction } from '~types';
import { TokenType } from '~gql';

import { MSG } from '../../detailsWidgetConfig';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../SafeTransactionDetail.css';

const renderTokenIcon = (tokenData: Token) => {
  if (tokenData.name === 'Ether') {
    return (
      <Icon className={styles.ether} name="ether-purple" title="Ether Logo" />
    );
  }

  if (tokenData.type === TokenType.Erc20) {
    return (
      <Avatar
        className={styles.tokenAvatar}
        avatar={tokenData.thumbnail}
        notSet={!tokenData.thumbnail}
        title={`${tokenData.name} token logo`}
        placeholderIcon="circle-close"
        seed={tokenData.tokenAddress.toLowerCase()}
      />
    );
  }

  return (
    <Avatar
      notSet
      title={tokenData.name}
      placeholderIcon="circle-close"
      seed={tokenData.tokenAddress.toLowerCase()}
    />
  );
};

interface ValueProps {
  transaction: SafeTransaction;
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
