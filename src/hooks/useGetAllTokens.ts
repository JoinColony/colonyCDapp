import { useMemo } from 'react';

import { getNetworkTokenList } from '~constants/tokens';
import { notNull } from '~utils/arrays';

import useColonyContext from './useColonyContext';

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
