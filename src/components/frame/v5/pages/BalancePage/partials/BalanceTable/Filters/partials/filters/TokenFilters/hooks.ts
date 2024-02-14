import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { notNull } from '~utils/arrays/index.ts';

export const useGetTokenTypeFilters = () => {
  const { colony } = useColonyContext();

  return useMemo(
    () =>
      colony.tokens?.items.filter(notNull).sort((a, b) => {
        if (!a.token || !b.token) return 0;

        return a.token.name
          .toLowerCase()
          .localeCompare(b.token.name.toLowerCase());
      }) || [],
    [colony.tokens?.items],
  );
};
