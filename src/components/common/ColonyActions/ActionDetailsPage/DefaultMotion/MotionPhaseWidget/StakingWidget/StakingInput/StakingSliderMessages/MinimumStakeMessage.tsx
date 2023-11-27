import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Numeral from '~shared/Numeral';

import styles from './MinimumStakeMessage.css';

const displayName =
  'common.ColonyActions.DefaultMotion.StakingWidget.StakingInput.MinimumStakeMessage';

const MSG = defineMessages({
  minimumAmount: {
    id: `${displayName}.minimumAmount`,
    defaultMessage: 'Activate at least {minStake}',
  },
});

export interface MinimumStakeMessageProps {
  userMinStake: string;
  decimals: number;
  symbol: string;
}

const MinimumStakeMessage = ({
  userMinStake,
  decimals,
  symbol,
}: MinimumStakeMessageProps) => (
  <span className={styles.minAmount}>
    <FormattedMessage
      {...MSG.minimumAmount}
      values={{
        minStake: (
          <Numeral
            className={styles.minAmount}
            value={userMinStake}
            decimals={decimals}
            suffix={symbol}
          />
        ),
      }}
    />
  </span>
);

MinimumStakeMessage.displayName = displayName;

export default MinimumStakeMessage;
