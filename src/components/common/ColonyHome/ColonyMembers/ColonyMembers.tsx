import React from 'react';
// import { defineMessages } from 'react-intl';
// import { ROOT_DOMAIN_ID } from '@colony/colony-js';

// import { MiniSpinnerLoader } from '~shared/Preloaders';
// import { Colony, useContributorsAndWatchersQuery } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { FullColony } from '~gql';

// import styles from './ColonyMembers.css';
import MembersSubsection from './MembersSubsection';

const displayName = 'common.ColonyHome.ColonyMembers';

// const MSG = defineMessages({
//   title: {
//     id: `${displayName}.title`,
//     defaultMessage: 'Members',
//   },
//   loadingData: {
//     id: `${displayName}.loadingData`,
//     defaultMessage: 'Loading members information...',
//   },
// });

interface Props {
  colony: FullColony;
  currentDomainId?: number;
  maxAvatars?: number;
}

const ColonyMembers = ({
  // colony: { colonyAddress, name },
  colony,
  currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
  maxAvatars,
}: Props) => {
  // const {
  //   data: members,
  //   loading: loadingMembers,
  // } = useContributorsAndWatchersQuery({
  //   variables: {
  //     colonyAddress,
  //     colonyName,
  //     domainId: currentDomainId,
  //   },
  // });

  // if (loadingMembers) {
  //   return (
  //     <MiniSpinnerLoader
  //       className={styles.main}
  //       title={MSG.title}
  //       loadingText={MSG.loadingData}
  //       titleTextValues={{ hasCounter: false }}
  //     />
  //   );
  // }

  return (
    <>
      {/* <MembersSubsection
        members={members?.contributorsAndWatchers?.contributors}
        colony={colony}
        isContributorsSubsection
      /> */}
      {/* {(currentDomainId === ROOT_DOMAIN_ID || */}
      {(currentDomainId === 0 ||
        currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) && (
        <MembersSubsection
          // members={members?.contributorsAndWatchers?.watchers}
          colony={colony}
          maxAvatars={maxAvatars}
          isContributorsSubsection={false}
        />
      )}
    </>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
