import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Numeral from '~shared/Numeral';

import styles from './UserStakeMessage.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.UserStakeMessage';

const MSG = defineMessages({
  userStake: {
    id: `${displayName}.userStake`,
    defaultMessage: `You staked {userPercentage}% of this motion ({userStake}).`,
  },
});
const UserStakeMessage = () => {
  const nativeTokenSymbol = 'WILL';
  const nativeTokenDecimals = 18;
  const userStake = '100000000000000000';
  const formattedUserStakePercentage = 10;

  return (
    <p className={styles.userStake}>
      <FormattedMessage
        {...MSG.userStake}
        values={{
          userPercentage: formattedUserStakePercentage,
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
