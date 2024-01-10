import React from 'react';

import ColonyHomeInfo from '~common/ColonyHome/ColonyHomeInfo';
import Members from '~common/Members';

import MemberControls from './MemberControls';
import MembersFilter from './MembersFilter';
import TotalReputation from './TotalReputation';
import useColonyMembers from './useColonyMembers';

import styles from './ColonyMembers.css';

const displayName = 'common.ColonyMembers';

const ColonyMembers = () => {
  // const { extensionId } = useParams<{
  //   extensionId?: string;
  // }>();
  const {
    filters,
    selectedDomainId,
    setSelectedDomainId,
    handleFilterChange,
    isRootOrAllDomains,
    isMobile,
  } = useColonyMembers();

  // if (!isExtensionIdValid) {
  //   return <NotFoundRoute />;
  // }

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
