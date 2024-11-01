import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { TEAM_SEARCH_PARAM } from '~routes';

import { ColonyFiltersContext } from './ColonyFiltersContext.ts';

const ColonyFiltersContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { colonyName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const teamSearchParam = searchParams.get(TEAM_SEARCH_PARAM);

  const [filteredTeam, setFilteredTeam] = useState<string | null>(
    teamSearchParam,
  );

  const [currentColonyName, setCurrentColonyName] = useState(colonyName);

  const updateTeamFilter = useCallback(
    (domainId: string, options) => {
      setFilteredTeam(domainId);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(TEAM_SEARCH_PARAM, domainId);
      setSearchParams(newSearchParams, options);
    },
    [searchParams, setSearchParams],
  );

  const resetTeamFilter = useCallback(() => {
    setFilteredTeam(null);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(TEAM_SEARCH_PARAM);
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams, setFilteredTeam]);

  const value = useMemo(
    () => ({
      filteredTeam,
      updateTeamFilter,
      resetTeamFilter,
    }),
    [filteredTeam, updateTeamFilter, resetTeamFilter],
  );

  useEffect(() => {
    if (currentColonyName !== colonyName) {
      setFilteredTeam(null);
      setCurrentColonyName(colonyName);
    }
  }, [colonyName, currentColonyName]);

  useEffect(() => {
    /**
     * If the TEAM_SEARCH_PARAM changed in the meantime and is different than the cached filteredTeam
     * We want to update the filteredTeam to reflect the search params change
     */
    if (teamSearchParam && teamSearchParam !== filteredTeam) {
      setFilteredTeam(teamSearchParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamSearchParam]);

  return (
    <ColonyFiltersContext.Provider value={value}>
      {children}
    </ColonyFiltersContext.Provider>
  );
};

export default ColonyFiltersContextProvider;
