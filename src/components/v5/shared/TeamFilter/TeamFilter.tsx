import React from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { notMaybe } from '~utils/arrays/index.ts';
import ArrowScroller from '~v5/common/ArrowScroller/ArrowScroller.tsx';

import AllTeamsItem from './partials/AllTeamsItem.tsx';
import CreateNewTeamItem from './partials/CreateNewTeamItem.tsx';
import { LeftButton } from './partials/LeftButton.tsx';
import { RightButton } from './partials/RightButton.tsx';
import TeamItem from './partials/TeamItem.tsx';

const displayName = 'v5.shared.TeamFilter';

const TeamFilter = () => {
  const {
    colony: { domains },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();

  const allDomains = domains?.items.filter(notMaybe) || [];

  const leftButton = <LeftButton />;
  const rightButton = <RightButton />;

  return (
    <ArrowScroller
      className="flex w-fit whitespace-nowrap rounded-lg border border-solid border-gray-200"
      buttonLeftContent={leftButton}
      buttonRightContent={rightButton}
    >
      <AllTeamsItem selected={selectedDomain === undefined} />
      {allDomains.map((domain) => (
        <TeamItem
          key={`teamFilter.${domain.id}`}
          selected={selectedDomain?.nativeId === domain.nativeId}
          domain={domain}
        />
      ))}
      <CreateNewTeamItem />
    </ArrowScroller>
  );
};

TeamFilter.displayName = displayName;
export default TeamFilter;
