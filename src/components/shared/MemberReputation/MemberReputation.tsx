import React from 'react';
import { defineMessages } from 'react-intl';

import Numeral from '~shared/Numeral';
import Icon from '~shared/Icon';
import { calculatePercentageReputation, ZeroValue } from '~utils/reputation';

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
}

const MemberReputation = ({
  userReputation,
  totalReputation,
  showIconTitle = true,
}: Props) => {
  const percentageReputation = calculatePercentageReputation(
    userReputation,
    totalReputation,
  );

  /* Doing this cause Eslint yells at me if I use nested ternary */
  let iconTitle;
  if (!showIconTitle) {
    iconTitle = undefined;
  } else {
    iconTitle = percentageReputation
      ? MSG.starReputationTitle
      : MSG.starNoReputationTitle;
  }

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

      <Icon
        name="star"
        appearance={{ size: 'extraTiny' }}
        className={styles.icon}
        title={iconTitle}
        titleValues={
          showIconTitle
            ? {
                reputation: percentageReputation,
              }
            : undefined
        }
      />
    </div>
  );
};

MemberReputation.displayName = displayName;

export default MemberReputation;
