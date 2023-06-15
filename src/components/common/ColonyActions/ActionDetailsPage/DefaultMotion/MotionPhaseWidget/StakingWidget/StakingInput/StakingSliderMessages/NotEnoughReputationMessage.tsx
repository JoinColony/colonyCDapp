import { BigNumber } from 'ethers';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Numeral from '~shared/Numeral';

import styles from './StakingValidationMessage.css';

const displayName =
  'common.ColonyActions.StakingWidget.StakingSliderMessages.NotEnoughReputationMessage.tsx';

const MSG = defineMessages({
  notEnoughReputation: {
    id: `${displayName}.notEnoughReputation`,
    defaultMessage: `The minimum reputation required to stake in this team is {minimumReputation} points. When this motion was created you only had {userReputation} points, so you can't stake on this motion. If you now have more than {minimumReputation} Reputation points, you will be able to stake on future motions.`,
  },
});

interface NotEnoughReptationMessageProps {
  userMinStake: string;
  userMaxStake: BigNumber;
  nativeTokenDecimals: number;
}

const NotEnoughReputationMessage = ({
  userMinStake,
  userMaxStake,
  nativeTokenDecimals,
}: NotEnoughReptationMessageProps) => (
  <div className={styles.validationError}>
    <FormattedMessage
      {...MSG.notEnoughReputation}
      values={{
        minimumReputation: (
          <Numeral
            className={styles.validationError}
            value={userMinStake}
            decimals={nativeTokenDecimals}
          />
        ),
        userReputation: (
          <Numeral
            className={styles.validationError}
            value={userMaxStake}
            decimals={nativeTokenDecimals}
          />
        ),
      }}
    />
  </div>
);

export default NotEnoughReputationMessage;
