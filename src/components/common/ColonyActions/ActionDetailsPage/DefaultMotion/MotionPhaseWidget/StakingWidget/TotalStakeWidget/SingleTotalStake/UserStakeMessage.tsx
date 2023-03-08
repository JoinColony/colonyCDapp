import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useUserStakeMessage } from '~hooks';
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
  const {
    formattedUserStakePercentage,
    userStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
  } = useUserStakeMessage();
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
