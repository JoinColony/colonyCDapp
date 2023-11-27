import React from 'react';
import { defineMessages } from 'react-intl';
import Decimal from 'decimal.js';
import { Id } from '@colony/colony-js';

import Heading from '~shared/Heading';
import Numeral from '~shared/Numeral';

import { DEFAULT_TOKEN_DECIMALS, ADDRESS_ZERO } from '~constants';
import { useColonyContext } from '~hooks';
import { useGetUserReputationQuery } from '~gql';

import styles from './TotalReputation.css';

const displayName = 'common.ColonyMembers.TotalReputation';

const MSG = defineMessages({
  totalReputationTitle: {
    id: `${displayName}.totalReputationTitle`,
    defaultMessage: 'Total reputation in the team',
  },
});

type Props = {
  selectedDomainId: number;
};

const TotalReputation = ({ selectedDomainId }: Props) => {
  const { colony } = useColonyContext();
  const { data: totalReputation } = useGetUserReputationQuery({
    variables: {
      input: {
        walletAddress: ADDRESS_ZERO,
        colonyAddress: colony?.colonyAddress || '',
        domainId: selectedDomainId || Id.RootDomain,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <div className={styles.teamReputationPointsContainer}>
      <Heading
        text={MSG.totalReputationTitle}
        appearance={{ size: 'normal', theme: 'dark' }}
      />
      <p className={styles.reputationPoints}>
        <Numeral
          value={new Decimal(totalReputation?.getUserReputation || '0')
            .abs()
            .toString()}
          decimals={colony?.nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS}
          suffix="reputation points"
        />
      </p>
    </div>
  );
};

TotalReputation.displayName = displayName;

export default TotalReputation;
