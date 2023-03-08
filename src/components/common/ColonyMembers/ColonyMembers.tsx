import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import ColonyHomeInfo from '~common/ColonyHome/ColonyHomeInfo';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN_ID } from '~constants';
import Members from '~common/Members';
import NotFoundRoute from '~routes/NotFoundRoute';
import { useColonyContext, useMobile } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';

import MemberControls from './MemberControls';
import MembersFilter, { FormValues } from './MembersFilter';
import { MemberType, VerificationType } from './MembersFilter/filtersConfig';
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
  });

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const handleFilterChange = (name, value) => {
    if (filters[name] !== value) {
      setFilters((filter) => ({
        ...filter,
        [name]: value,
      }));
    }
  };

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
        {isMobile && <ColonyHomeInfo />}
        <div className={styles.mainContent}>
          <Members
            selectedDomain={selectedDomainId}
            handleDomainChange={setSelectedDomainId}
            filters={filters}
          />
        </div>
        <aside className={styles.rightAside}>
          <TotalReputation selectedDomainId={selectedDomainId} />
          <MemberControls isRootDomain={isRootDomain} />
          <MembersFilter
            handleFilterChange={handleFilterChange}
            isRoot={isRootDomain}
          />
        </aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
