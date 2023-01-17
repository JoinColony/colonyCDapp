import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import ColonyHomeInfo from '~common/ColonyHome/ColonyHomeInfo';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN_ID } from '~constants';
import Members from '~common/Members';
import NotFoundRoute from '~routes/NotFoundRoute';
import { useColonyContext, useMobile } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';

import MemberControls from './MemberControls';
import MembersFilter, {
  BannedStatus,
  FormValues,
  MemberType,
  VerificationType,
} from './MembersFilter';
import TotalReputation from './TotalReputation';

import styles from './ColonyMembers.css';

const displayName = 'common.ColonyMembers';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Colony',
  },
});

const ColonyMembers = () => {
  const { colony, loading } = useColonyContext();

  const [filters, setFilters] = useState<FormValues>({
    memberType: MemberType.All,
    verificationType: VerificationType.All,
    bannedStatus: BannedStatus.All,
  });

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const isRootDomain =
    selectedDomainId === ROOT_DOMAIN_ID ||
    selectedDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID;

  const isMobile = useMobile();

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <SpinnerLoader loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (!colony) {
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
          <TotalReputation selectedDomainId={selectedDomainId} />
          <MemberControls isRootDomain={isRootDomain} />
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
