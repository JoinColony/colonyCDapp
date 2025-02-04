import React from 'react';

import { SUPPORTED_CHAINS } from '~constants/proxyColonies.ts';

export const chainFilters = SUPPORTED_CHAINS.map(
  ({ name, icon: Icon, chainId }) => ({
    name,
    symbol: name,
    filterKey: chainId,
    label: (
      <div className="flex items-start gap-2">
        {Icon && <Icon size={20} />}
        {name}
      </div>
    ),
  }),
);
