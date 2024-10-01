import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { TEAM_SEARCH_PARAM } from '~routes';

import { ColonyFiltersContext } from './ColonyFiltersContext.ts';

const ColonyFiltersContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { colonyName } = useParams();

  const [filteredTeam, setFilteredTeam] = useState<string | null>(null);

  const [currentColonyName, setCurrentColonyName] = useState(colonyName);

  const [queryParams, setQueryParams] = useSearchParams();
  const value = useMemo(
    () => ({
      filteredTeam,
      setFilteredTeam,
    }),
    [filteredTeam, setFilteredTeam],
  );

  useEffect(() => {
    if (currentColonyName !== colonyName) {
      setFilteredTeam(null);
      setCurrentColonyName(colonyName);
      return;
    }

    if (queryParams.get(TEAM_SEARCH_PARAM)) {
      setFilteredTeam(queryParams.get(TEAM_SEARCH_PARAM));
    }
  }, [colonyName, currentColonyName, queryParams, setQueryParams]);

  return (
    <ColonyFiltersContext.Provider value={value}>
      {children}
    </ColonyFiltersContext.Provider>
  );
};

export default ColonyFiltersContextProvider;
