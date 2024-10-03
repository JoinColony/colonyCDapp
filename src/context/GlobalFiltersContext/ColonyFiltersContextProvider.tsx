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

  const [filteredTeam, setFilteredTeam] = useState<string | null>(
    searchParams.get(TEAM_SEARCH_PARAM),
  );

  const [currentColonyName, setCurrentColonyName] = useState(colonyName);

  const updateTeamFilter = useCallback(
    (domainId: string) => {
      setFilteredTeam(domainId);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(TEAM_SEARCH_PARAM, domainId);
      setSearchParams(newSearchParams);
      setFilteredTeam(domainId);
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

  return (
    <ColonyFiltersContext.Provider value={value}>
      {children}
    </ColonyFiltersContext.Provider>
  );
};

export default ColonyFiltersContextProvider;
