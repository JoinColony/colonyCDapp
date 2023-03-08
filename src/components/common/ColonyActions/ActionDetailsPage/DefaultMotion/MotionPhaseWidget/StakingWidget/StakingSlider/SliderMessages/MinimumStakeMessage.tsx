import classNames from 'classnames';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useStakingWidgetContext } from '../../StakingWidgetProvider';
import TokensLeftToActivate from './TokensLeftToActivate';

import styles from './MinimumStakeMessage.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.MinimumStakeMessage';

const MSG = defineMessages({
  minimumAmount: {
    id: `${displayName}.minimumAmount`,
    defaultMessage: 'Activate at least {minStake}',
  },
});

const MinimumStakeMessage = () => {
  const { nativeTokenSymbol } = useStakingWidgetContext();
  return (
    <span className={classNames(styles.minStakeAmount)}>
      <FormattedMessage
        {...MSG.minimumAmount}
        values={{
          minStake: (
            <TokensLeftToActivate
              className={styles.minStakeAmount}
              suffix={nativeTokenSymbol}
            />
          ),
        }}
      />
    </span>
  );
};

MinimumStakeMessage.displayName = displayName;

export default MinimumStakeMessage;
