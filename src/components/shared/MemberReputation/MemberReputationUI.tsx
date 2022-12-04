import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import Decimal from 'decimal.js';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import Numeral from '~shared/Numeral';
import Icon from '~shared/Icon';

import { ZeroValue } from '~utils/reputation';
import { getFormattedTokenValue } from '~utils/tokens';

import styles from './MemberReputation.css';

const displayName = 'MemberReputationUI';

const MSG = defineMessages({
  starReputationTitle: {
    id: `${displayName}.starReputationTitle`,
    defaultMessage: `User reputation value: {reputation}%`,
  },
  starNoReputationTitle: {
    id: `${displayName}.starNoReputationTitle`,
    defaultMessage: `User has no reputation`,
  },
});

interface Props {
  onReputationLoaded?: (reputationLoaded: boolean) => void;
  showIconTitle?: boolean;
  showReputationPoints?: boolean;
  nativeTokenDecimals?: number;
  userPercentageReputation?: number;
  reputationAmount?: string;
}

const MemberReputationUI = ({
  onReputationLoaded = () => null,
  showIconTitle = true,
  showReputationPoints = false,
  nativeTokenDecimals = DEFAULT_TOKEN_DECIMALS,
  userPercentageReputation,
  reputationAmount,
}: Props) => {
  const formattedReputationPoints = getFormattedTokenValue(
    new Decimal(reputationAmount || 0).toString(),
    nativeTokenDecimals,
  );

  // useEffect(() => {
  //   onReputationLoaded(!!userReputationData);
  // }, [userReputationData, onReputationLoaded]);

  /* Doing this cause Eslint yells at me if I use nested ternary */
  let iconTitle;
  if (!showIconTitle) {
    iconTitle = undefined;
  } else {
    iconTitle = userPercentageReputation
      ? MSG.starReputationTitle
      : MSG.starNoReputationTitle;
  }

  return (
    <div className={styles.reputationWrapper}>
      {!userPercentageReputation && (
        <div className={styles.reputation}>— %</div>
      )}
      {userPercentageReputation === ZeroValue.NearZero && (
        <div className={styles.reputation}>{userPercentageReputation}</div>
      )}
      {userPercentageReputation &&
        userPercentageReputation !== ZeroValue.NearZero && (
          <Numeral
            className={styles.reputation}
            appearance={{ theme: 'primary' }}
            value={userPercentageReputation}
            suffix="%"
          />
        )}
      {showReputationPoints && (
        <div className={styles.reputationPointsContainer}>
          <span className={styles.reputationPoints}>(</span>
          <Numeral
            className={styles.reputationPoints}
            appearance={{ theme: 'primary' }}
            value={formattedReputationPoints}
            suffix="pts)"
          />
        </div>
      )}
      <Icon
        name="star"
        appearance={{ size: 'extraTiny' }}
        className={styles.icon}
        title={iconTitle}
        titleValues={
          showIconTitle
            ? {
                reputation: userPercentageReputation,
              }
            : undefined
        }
      />
    </div>
  );
};

MemberReputationUI.displayName = displayName;

export default MemberReputationUI;
