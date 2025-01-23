import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useColonyFiltersContext } from '~context/GlobalFiltersContext/ColonyFiltersContext.ts';
import { useMobile } from '~hooks';
import { TEAM_SEARCH_PARAM } from '~routes';
import { notMaybe } from '~utils/arrays/index.ts';

import DesktopTeamFilter from './partials/DesktopTeamFilter/DesktopTeamFilter.tsx';
import MobileTeamFilter from './partials/MobileTeamFilter.tsx';

const displayName = 'v5.shared.TeamFilter';

const TeamFilter = () => {
  const isMobile = useMobile();
  const [searchParams] = useSearchParams();

  const { filteredTeam, updateTeamFilter } = useColonyFiltersContext();

  const {
    colony: { domains },
  } = useColonyContext();

  // We need to set the query param based on the already stored filteredTeam
  // but only on the pages where we actually use this component
  useEffect(() => {
    if (filteredTeam && !searchParams.get(TEAM_SEARCH_PARAM)) {
      updateTeamFilter(filteredTeam, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // this is in memo due to being a dependency for the other memos inside the components
  const allDomains = useMemo(() => {
    const filteredDomains = domains?.items.filter(notMaybe) || [];

    return filteredDomains.sort((a, b) => {
      const reputationA = parseFloat(a.reputationPercentage || '0');
      const reputationB = parseFloat(b.reputationPercentage || '0');

      // Sort by reputation percentage in descending order
      if (reputationA !== reputationB) {
        return reputationB - reputationA;
      }

      // If reputation percentages are equal or missing, sort alphabetically by name
      const nameA = a.metadata?.name || '';
      const nameB = b.metadata?.name || '';
      return nameA.localeCompare(nameB);
    });
  }, [domains?.items]);

  if (isMobile) {
    return <MobileTeamFilter allDomains={allDomains} />;
  }

  return <DesktopTeamFilter allDomains={allDomains} />;
};

TeamFilter.displayName = displayName;
export default TeamFilter;
