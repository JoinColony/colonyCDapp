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
  const [searchParams] = useSearchParams();

  const { filteredTeam, updateTeamFilter } = useColonyFiltersContext();

  // We need to set the query param based on the already stored filteredTeam
  // but only on the pages where we actually use this component
  useEffect(() => {
    if (filteredTeam && !searchParams.get(TEAM_SEARCH_PARAM)) {
      updateTeamFilter(filteredTeam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isMobile) {
    return <MobileTeamFilter />;
  }

  return <DesktopTeamFilter />;
};

TeamFilter.displayName = displayName;
export default TeamFilter;
