import React from 'react';
// import { defineMessages } from 'react-intl';

// import { ROOT_DOMAIN_ID } from '@colony/colony-js';

// import { MiniSpinnerLoader } from '~shared/Preloaders';

// import { Colony, useContributorsAndWatchersQuery } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyContext } from '~hooks';
// import { useGetMembersForColonyQuery } from '~gql';

// import styles from './ColonyMembersWidget.css';
import MembersSubsection from './MembersSubsection';

const displayName = 'common.ColonyHome.ColonyMembersWidget';

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
  currentDomainId?: number;
  maxAvatars?: number;
}

const ColonyMembersWidget = ({
  currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
  maxAvatars,
}: Props) => {
  const { colony } = useColonyContext();
  if (!colony) return null;
  // console.log(`🚀 ~ colony`, colony);

  // const { data, loading } = useGetMembersForColonyQuery({
  //   skip: !colony?.colonyAddress,
  //   variables: {
  //     input: {
  //       colonyAddress: colony?.colonyAddress ?? '',
  //     },
  //   },
  //   fetchPolicy: 'cache-and-network',
  // });

  // console.log(`🚀 ~ data`, data);

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

  // if (loading) {
  //   console.log(`🚀 ~ loadingMembers`, loading);

  // return (
  //   <MiniSpinnerLoader
  //     className={styles.main}
  //     title={MSG.title}
  //     loadingText={MSG.loadingData}
  //     titleTextValues={{ hasCounter: false }}
  //   />
  // );
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

ColonyMembersWidget.displayName = displayName;

export default ColonyMembersWidget;
