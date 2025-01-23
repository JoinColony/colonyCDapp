import React, { useMemo } from 'react';

import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { type Domain } from '~types/graphql.ts';
import ArrowScroller from '~v5/common/ArrowScroller/ArrowScroller.tsx';

import AllTeamsItem from './AllTeamsItem.tsx';
import CreateNewTeamItem from './CreateNewTeamItem.tsx';
import { LeftButton } from './LeftButton.tsx';
import { RightButton } from './RightButton.tsx';
import TeamItem from './TeamItem.tsx';

const displayName = 'v5.shared.TeamFilter.MobileTeamFilter';

const MobileTeamFilter = ({ allDomains }: { allDomains: Domain[] }) => {
  const selectedDomain = useGetSelectedDomainFilter();

  const selectedDomainIndex = useMemo(
    () =>
      allDomains.findIndex(
        (domain) => selectedDomain?.nativeId === domain.nativeId,
      ),
    [selectedDomain, allDomains],
  );

  const leftButton = <LeftButton />;
  const rightButton = <RightButton />;

  return (
    <ArrowScroller
      className="flex h-[34px] w-fit whitespace-nowrap rounded-lg no-scrollbar"
      buttonLeftContent={leftButton}
      buttonRightContent={rightButton}
    >
      <AllTeamsItem
        selected={selectedDomain === undefined}
        // The item should have a delimiter only if it is not the first one before the selected team
        hasDelimiter={selectedDomainIndex !== 0}
      />
      {allDomains.map((domain, index) => (
        <TeamItem
          key={`teamFilter.${domain.id}`}
          selected={selectedDomain?.nativeId === domain.nativeId}
          // The item should have a delimiter only if it is not the first one before the selected team
          hasDelimiter={index !== selectedDomainIndex - 1}
          domain={domain}
        />
      ))}
      <CreateNewTeamItem />
    </ArrowScroller>
  );
};

MobileTeamFilter.displayName = displayName;
export default MobileTeamFilter;
