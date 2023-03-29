import React from 'react';
import { defineMessages } from 'react-intl';

import ColonyHomeInfo from '~common/ColonyHome/ColonyHomeInfo';
import Members from '~common/Members';
import NotFoundRoute from '~routes/NotFoundRoute';
import { useColonyContext } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';

import MemberControls from './MemberControls';
import MembersFilter from './MembersFilter';
import TotalReputation from './TotalReputation';
import useColonyMembers from './useColonyMembers';

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
  const {
    filters,
    selectedDomainId,
    setSelectedDomainId,
    handleFilterChange,
    isRootOrAllDomains,
    isMobile,
  } = useColonyMembers();

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
            isRootOrAllDomains={isRootOrAllDomains}
          />
        </div>
        <aside className={styles.rightAside}>
          <TotalReputation selectedDomainId={selectedDomainId} />
          <MemberControls isRootOrAllDomains={isRootOrAllDomains} />
          <MembersFilter
            onFilterChange={handleFilterChange}
            isRootOrAllDomains={isRootOrAllDomains}
          />
        </aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
