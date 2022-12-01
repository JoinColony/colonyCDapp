import React from 'react';
import { defineMessages } from 'react-intl';

import { MiniSpinnerLoader } from '~shared/Preloaders';
import { ROOT_DOMAIN_ID, COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyContext } from '~hooks';
import { useGetMembersForColonyQuery } from '~gql';

import MembersSubsection from './MembersSubsection';

import styles from './ColonyMembersWidget.css';

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

const ROOT_DOMAIN_ID = 0;
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

  if (!colony) return null;

  const contributors = data?.getMembersForColony?.contributors;
  const watchers = data?.getMembersForColony?.watchers;

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
      {(currentDomainId === ROOT_DOMAIN_ID ||
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
