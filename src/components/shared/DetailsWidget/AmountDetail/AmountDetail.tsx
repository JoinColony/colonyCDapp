import React, { ReactNode } from 'react';

import { Token } from '~types';
import TokenIcon from '~shared/TokenIcon';

import styles from './AmountDetail.css';

const displayName = 'DetailsWidget.AmountDetail';

interface AmountDetailProps {
  amount: ReactNode; // Numeral component
  symbol: ReactNode; // span
  token?: Token;
}

const AmountDetail = ({ amount, symbol, token }: AmountDetailProps) => (
  <div className={styles.tokenContainer}>
    {token && <TokenIcon token={token} size="xxs" />}
    <span>
      {amount} {symbol}
    </span>
  </div>
);

AmountDetail.displayName = displayName;

export default AmountDetail;
