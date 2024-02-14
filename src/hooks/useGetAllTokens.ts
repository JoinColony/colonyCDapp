import { useMemo } from 'react';

import { getNetworkTokenList } from '~constants/tokens/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { notNull } from '~utils/arrays/index.ts';

export const useGetAllTokens = () => {
  const { colony } = useColonyContext();
  const predefinedTokens = getNetworkTokenList();
  const colonyTokens = useMemo(
    () => colony.tokens?.items.filter(notNull) || [],
    [colony.tokens?.items],
  );

  return useMemo(
    () => [...colonyTokens, ...predefinedTokens],
    [colonyTokens, predefinedTokens],
  );
};
