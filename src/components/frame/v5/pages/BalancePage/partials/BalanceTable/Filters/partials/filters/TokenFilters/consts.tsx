import React, { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import TokenIcon from '~shared/TokenIcon/index.ts';
import { notNull } from '~utils/arrays/index.ts';

export const useGetTokenTypeFilters = () => {
  const { colony } = useColonyContext();
  const colonyTokens = useMemo(
    () =>
      colony.tokens?.items.filter(notNull).sort((a, b) => {
        if (!a.token || !b.token) return 0;

        return a.token.name
          .toLowerCase()
          .localeCompare(b.token.name.toLowerCase());
      }) || [],
    [colony.tokens?.items],
  );

  return colonyTokens.map(({ token }) => ({
    symbol: token.symbol,
    label: (
      <div className="flex items-center gap-2">
        <TokenIcon token={token} size="xxxs" />
        {token.symbol}
      </div>
    ),
    name: token?.tokenAddress || '',
  }));
};
