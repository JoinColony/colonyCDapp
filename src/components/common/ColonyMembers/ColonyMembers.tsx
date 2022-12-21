import React, { useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import Decimal from 'decimal.js';

import { SpinnerLoader } from '~shared/Preloaders';
import Heading from '~shared/Heading';
import Numeral from '~shared/Numeral';
import InviteLinkButton from '~shared/Button/InviteLinkButton';
import Members from '~common/Members';
import ColonyHomeInfo from '~common/ColonyHome/ColonyHomeInfo';
import NotFoundRoute from '~routes/NotFoundRoute';

import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  ROOT_DOMAIN_ID,
  DEFAULT_TOKEN_DECIMALS,
  ADDRESS_ZERO,
} from '~constants';
import { useColonyContext, useMobile } from '~hooks';
import { getFormattedTokenValue } from '~utils/tokens';
import { useGetUserReputationQuery } from '~gql';

import MemberControls from './MemberControls';
import MembersFilter, {
  BannedStatus,
  FormValues,
  MemberType,
  VerificationType,
} from './MembersFilter';

import styles from './ColonyMembers.css';

const displayName = 'common.ColonyMembers';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Colony',
  },
  totalReputationTitle: {
    id: `${displayName}.totalReputationTitle`,
    defaultMessage: 'Total reputation in the team',
  },
});

const ColonyMembers = () => {
  const { colony, loading } = useColonyContext();

  const [filters, setFilters] = useState<FormValues>({
    memberType: MemberType.ALL,
    verificationType: VerificationType.ALL,
    bannedStatus: BannedStatus.ALL,
  });

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const isRootDomain = useMemo(
    () =>
      selectedDomainId === ROOT_DOMAIN_ID ||
      selectedDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID,
    [selectedDomainId],
  );

  const { data: totalReputation } = useGetUserReputationQuery({
    variables: {
      input: {
        walletAddress: ADDRESS_ZERO,
        colonyAddress: colony?.colonyAddress || '',
        domainId: selectedDomainId || ROOT_DOMAIN_ID,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const nativeToken = (colony?.tokens?.items || []).find(
    (colonyToken) =>
      colonyToken?.token?.tokenAddress === colony?.nativeToken.tokenAddress,
  )?.token;

  const formattedTotalDomainRep = getFormattedTokenValue(
    new Decimal(totalReputation?.getUserReputation || '0').abs().toString(),
    nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS,
  );

  const isMobile = useMobile();

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <SpinnerLoader loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (!colony?.name || !colony) {
    return <NotFoundRoute />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.mainContentGrid}>
        {isMobile && <ColonyHomeInfo showNavigation isMobile />}
        <div className={styles.mainContent}>
          {colony && (
            <Members
              selectedDomain={selectedDomainId}
              handleDomainChange={setSelectedDomainId}
              filters={filters}
            />
          )}
        </div>
        <aside className={styles.rightAside}>
          <div className={styles.teamReputationPointsContainer}>
            <Heading
              text={MSG.totalReputationTitle}
              appearance={{ size: 'normal', theme: 'dark' }}
            />
            <p className={styles.reputationPoints}>
              <Numeral
                value={formattedTotalDomainRep}
                suffix="reputation points"
              />
            </p>
          </div>
          <ul className={styles.controls}>
            {isRootDomain && (
              <li>
                <InviteLinkButton
                  colonyName={colony?.name}
                  buttonAppearance={{ theme: 'blue' }}
                />
              </li>
            )}
            <MemberControls />
          </ul>
          <MembersFilter
            handleFiltersCallback={setFilters}
            isRoot={isRootDomain}
          />
        </aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
