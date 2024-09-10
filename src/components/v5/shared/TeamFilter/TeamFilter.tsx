import React from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { notMaybe } from '~utils/arrays/index.ts';

import AllTeamsItem from './partials/AllTeamsItem.tsx';
import CreateNewTeamItem from './partials/CreateNewTeamItem.tsx';
import TeamItem from './partials/TeamItem.tsx';

const MAX_TEAM_LIMIT = 10;

const displayName = 'v5.shared.TeamFilter';

const TeamFilter = () => {
  const {
    colony: { domains },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();

  const allDomains = domains?.items.filter(notMaybe) || [];

  const domainsForMenu = allDomains.slice(0, MAX_TEAM_LIMIT);
  // const domainsForDropdown = allDomains.slice(MAX_TEAM_LIMIT);

  return (
    <div className="flex w-fit max-w-full overflow-hidden rounded-lg border border-solid  border-gray-200">
      <AllTeamsItem selected={selectedDomain === undefined} />
      {domainsForMenu.map((domain) => (
        <TeamItem
          key={`teamFilter.${domain.id}`}
          selected={selectedDomain?.nativeId === domain.nativeId}
          domain={domain}
        />
      ))}
      <CreateNewTeamItem />
    </div>
  );
};

TeamFilter.displayName = displayName;
export default TeamFilter;
