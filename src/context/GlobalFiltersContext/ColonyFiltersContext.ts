import { createContext, useContext } from 'react';

import type React from 'react';

interface ColonyFiltersContextValue {
  filteredTeam: string | null;
  setFilteredTeam: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ColonyFiltersContext = createContext<ColonyFiltersContextValue>({
  filteredTeam: null,
  setFilteredTeam: () => {},
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
