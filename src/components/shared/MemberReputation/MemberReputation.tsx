import React from 'react';
import { defineMessages } from 'react-intl';
import Decimal from 'decimal.js';

import Numeral from '~shared/Numeral';
import Icon from '~shared/Icon';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { calculatePercentageReputation, ZeroValue } from '~utils/reputation';
import { getFormattedTokenValue } from '~utils/tokens';

import styles from './MemberReputation.css';

const displayName = 'MemberReputation';

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
  userReputation?: string;
  totalReputation?: string;
  showIconTitle?: boolean;
  userReputationPercentage?: string;
  showReputationPoints?: boolean;
  nativeTokenDecimals?: number;
}

const MemberReputation = ({
  userReputation,
  totalReputation,
  showIconTitle = true,
  userReputationPercentage,
  showReputationPoints = false,
  nativeTokenDecimals = DEFAULT_TOKEN_DECIMALS,
}: Props) => {
  const percentageReputation =
    userReputationPercentage ||
    calculatePercentageReputation(userReputation, totalReputation);

  const formattedReputationPoints = getFormattedTokenValue(
    new Decimal(userReputation || 0).toString(),
    nativeTokenDecimals,
  );

  const title = percentageReputation
    ? MSG.starReputationTitle
    : MSG.starNoReputationTitle;
  const iconTitle = showIconTitle ? title : undefined;

  return (
    <div className={styles.reputationWrapper}>
      {!percentageReputation && <div className={styles.reputation}>— %</div>}
      {percentageReputation === ZeroValue.NearZero && (
        <div className={styles.reputation}>{percentageReputation}</div>
      )}
      {percentageReputation && percentageReputation !== ZeroValue.NearZero && (
        <Numeral
          className={styles.reputation}
          value={percentageReputation}
          suffix="%"
        />
      )}
      {showReputationPoints && (
        <div className={styles.reputationPointsContainer}>
          <span className={styles.reputationPoints}>(</span>
          <Numeral
            className={styles.reputationPoints}
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
        titleValues={{ reputation: percentageReputation }}
      />
    </div>
  );
};

MemberReputation.displayName = displayName;

export default MemberReputation;
