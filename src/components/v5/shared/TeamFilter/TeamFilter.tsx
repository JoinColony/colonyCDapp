import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useColonyFiltersContext } from '~context/GlobalFiltersContext/ColonyFiltersContext.ts';
import { useMobile } from '~hooks';
import { TEAM_SEARCH_PARAM } from '~routes';

import DesktopTeamFilter from './partials/DesktopTeamFilter/DesktopTeamFilter.tsx';
import MobileTeamFilter from './partials/MobileTeamFilter.tsx';

const displayName = 'v5.shared.TeamFilter';

const TeamFilter = () => {
  const isMobile = useMobile();
  const [searchParams, setSearchParams] = useSearchParams();

  const { filteredTeam } = useColonyFiltersContext();

  useEffect(() => {
    if (filteredTeam && searchParams.get(TEAM_SEARCH_PARAM) !== filteredTeam) {
      searchParams.append(TEAM_SEARCH_PARAM, filteredTeam);
      setSearchParams(searchParams);
    }
  }, [filteredTeam, searchParams, setSearchParams]);

  if (isMobile) {
    return <MobileTeamFilter />;
  }

  return <DesktopTeamFilter />;
};

TeamFilter.displayName = displayName;
export default TeamFilter;
