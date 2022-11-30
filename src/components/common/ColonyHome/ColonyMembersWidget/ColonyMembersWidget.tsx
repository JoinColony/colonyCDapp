import React from 'react';
import { defineMessages } from 'react-intl';

import { MiniSpinnerLoader } from '~shared/Preloaders';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyContext } from '~hooks';
import { useGetMembersForColonyQuery } from '~gql';

import styles from './ColonyMembersWidget.css';
import MembersSubsection from './MembersSubsection';

const displayName = 'common.ColonyHome.ColonyMembersWidget';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Members',
  },
  loadingData: {
    id: `${displayName}.loadingData`,
    defaultMessage: 'Loading members information...',
  },
});

interface Props {
  currentDomainId?: number;
  maxAvatars?: number;
}

const ColonyMembersWidget = ({
  currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
  maxAvatars,
}: Props) => {
  const { colony } = useColonyContext();

  const { data, loading: loadingMembers } = useGetMembersForColonyQuery({
    skip: !colony?.colonyAddress,
    variables: {
      input: {
        colonyAddress: colony?.colonyAddress ?? '',
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const contributors = data?.getMembersForColony?.contributors ?? [];
  const watchers = data?.getMembersForColony?.watchers ?? [];

  if (!colony) return null;

  if (loadingMembers) {
    return (
      <MiniSpinnerLoader
        className={styles.main}
        title={MSG.title}
        loadingText={MSG.loadingData}
        titleTextValues={{ hasCounter: false }}
      />
    );
  }
  return (
    <>
      <MembersSubsection
        members={contributors}
        colony={colony}
        isContributorsSubsection
      />
      {/* {(currentDomainId === ROOT_DOMAIN_ID || */}
      {(currentDomainId === 0 ||
        currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) && (
        <MembersSubsection
          members={watchers}
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
