import React from 'react';

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
  const { selectedDomainId, handleFilterChange, isRootOrAllDomains } =
    useColonyMembers();

  // if (!isExtensionIdValid) {
  //   return <NotFoundRoute />;
  // }

  return (
    <div className={styles.main}>
      <div className={styles.mainContentGrid}>
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
