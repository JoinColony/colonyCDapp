import React from 'react';

import { currencyApiConfig } from '~utils/currency/index.ts';
import { formatText } from '~utils/intl.ts';

const coinGeckoAttributionMessageValues = {
  a: (chunks: string[]) => (
    <a
      className="underline text-blue-400 font-medium decoration-blue-400 hover:text-gray-900"
      href={currencyApiConfig.attribution}
      target="_blank"
      rel="noreferrer"
    >
      {chunks}
    </a>
  ),
};

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.CoinGeckoAttribution';

const CoinGeckoAttribution = () => (
  <div className="text-xs pt-6">
    {formatText(
      { id: 'userMenu.coinGeckoAttribution' },
      coinGeckoAttributionMessageValues,
      'coinGeckoLink',
    )}
  </div>
);

CoinGeckoAttribution.displayName = displayName;

export default CoinGeckoAttribution;
