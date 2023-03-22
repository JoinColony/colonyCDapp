import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useAppContext, useColonyContext } from '~hooks';

import Numeral from '~shared/Numeral';
import { useStakingWidgetContext } from '../StakingWidgetProvider';

import styles from './UserStakeMessage.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.UserStakeMessage';

const MSG = defineMessages({
  userStake: {
    id: `${displayName}.userStake`,
    defaultMessage: `You staked {userStakePercentage}% of this motion ({userStake}).`,
  },
});
const UserStakeMessage = () => {
  const { colony } = useColonyContext();
  const { symbol: nativeTokenSymbol, decimals: nativeTokenDecimals } =
    colony?.nativeToken || {};

  const { usersStakes } = useStakingWidgetContext();
  const { user } = useAppContext();

  const userStakes = usersStakes.find(
    ({ address }) => address === user?.walletAddress,
  );

  const isObjection = false;
  const userStake = isObjection
    ? userStakes?.stakes.raw.nay
    : userStakes?.stakes.raw.yay;
  const userStakePercentage = userStakes?.stakes.percentage.yay;

  const hasUserStaked = !!(userStake && userStake !== '0');

  if (!hasUserStaked) {
    return null;
  }

  return (
    <p className={styles.userStake}>
      <FormattedMessage
        {...MSG.userStake}
        values={{
          userStakePercentage,
          userStake: (
            <Numeral
              value={userStake}
              suffix={nativeTokenSymbol}
              decimals={nativeTokenDecimals}
            />
          ),
        }}
      />
    </p>
  );
};

UserStakeMessage.displayName = displayName;

export default UserStakeMessage;
