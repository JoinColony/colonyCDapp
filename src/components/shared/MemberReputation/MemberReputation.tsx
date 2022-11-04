import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { gql, useQuery } from '@apollo/client';
import { Id } from '@colony/colony-js';

import { Address } from '~types';
import Numeral from '~shared/Numeral';
import Icon from '~shared/Icon';
import { calculatePercentageReputation, ZeroValue } from '~utils/reputation';
import { getUserReputation } from '~gql';
import { ADDRESS_ZERO } from '~constants';

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
  walletAddress: Address;
  colonyAddress: Address;
  domainId?: number;
  rootHash?: string;
  onReputationLoaded?: (reputationLoaded: boolean) => void;
  showIconTitle?: boolean;
}

const MemberReputation = ({
  walletAddress,
  colonyAddress,
  domainId = Id.RootDomain,
  rootHash,
  onReputationLoaded = () => null,
  showIconTitle = true,
}: Props) => {
  const { data: userReputationData } = useQuery(gql(getUserReputation), {
    variables: {
      input: {
        colonyAddress,
        walletAddress,
        domainId,
        rootHash,
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  const userReputation = userReputationData?.getUserReputation;

  const { data: totalReputationData } = useQuery(gql(getUserReputation), {
    variables: {
      input: {
        colonyAddress,
        walletAddress: ADDRESS_ZERO,
        domainId,
        rootHash,
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  const totalReputation = totalReputationData?.getUserReputation;

  const percentageReputation = calculatePercentageReputation(
    userReputation,
    totalReputation,
  );

  useEffect(() => {
    onReputationLoaded(!!userReputationData);
  }, [userReputationData, onReputationLoaded]);

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
