import { createContext, useContext } from 'react';

import noop from '~utils/noop.ts';

interface ColonyFiltersContextValue {
  filteredTeam: string | null;
  updateTeamFilter: (domainId: string) => void;
  resetTeamFilter: () => void;
}

export const ColonyFiltersContext = createContext<ColonyFiltersContextValue>({
  filteredTeam: null,
  updateTeamFilter: noop,
  resetTeamFilter: noop,
});

export const useColonyFiltersContext = () => {
  const context = useContext(ColonyFiltersContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "ColonyFiltersContext" provider',
    );
  }

  return context;
};
