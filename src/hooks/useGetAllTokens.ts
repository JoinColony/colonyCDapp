import { useMemo } from 'react';

import { getNetworkTokenList } from '~constants/tokens';
import { useColonyContext } from '~context/ColonyContext';
import { notNull } from '~utils/arrays';

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
