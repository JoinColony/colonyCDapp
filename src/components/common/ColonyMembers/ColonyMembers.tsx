import React, { useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import Decimal from 'decimal.js';
import { useMediaQuery } from 'react-responsive';

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
} from '~constants';
import { useColonyContext } from '~hooks';
import { getFormattedTokenValue } from '~utils/tokens';

import MemberControls from './MemberControls';
import MembersFilter, {
  BannedStatus,
  FormValues,
  MemberType,
  VerificationType,
} from './MembersFilter';

import queries from '~styles/queries.css';
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
  const { colony, loading, error } = useColonyContext();

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

  // const { data: totalReputation } = useUserReputationQuery({
  //   variables: {
  //     address: AddressZero,
  //     colonyAddress,
  //     domainId: selectedDomainId,
  //   },
  //   fetchPolicy: 'cache-and-network',
  // });

  const nativeToken = (colony?.tokens?.items || []).find(
    (colonyToken) =>
      colonyToken?.token?.tokenAddress === colony?.nativeToken.tokenAddress,
  )?.token;

  // temp until there is a query ready
  const totalReputation = {
    userReputation: 40000000000000000000,
  };

  const formattedTotalDomainRep = getFormattedTokenValue(
    new Decimal(totalReputation?.userReputation || '0').abs().toString(),
    nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS,
  );

  const isMobile = useMediaQuery({ query: queries.query700 });

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <SpinnerLoader loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (!colony?.name || error || !colony) {
    console.error(error);
    return <NotFoundRoute />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.mainContentGrid}>
        {isMobile && <ColonyHomeInfo colony={colony} showNavigation isMobile />}
        <div className={styles.mainContent}>
          {colony && (
            <Members
              selectedDomain={selectedDomainId}
              handleDomainChange={setSelectedDomainId}
              filters={filters}
              colony={colony}
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
            <MemberControls colony={colony} />
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
