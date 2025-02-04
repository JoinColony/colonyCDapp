import React, { type FC } from 'react';

import { useFiltersContext } from '~frame/v5/pages/BalancePage/partials/BalanceTable/Filters/FiltersContext/FiltersContext.ts';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { useGetTokenTypeFilters } from './hooks.ts';

const TokenFilters: FC = () => {
  const {
    filters: { token: tokenFilters },
    handleFiltersChange,
  } = useFiltersContext();

  const tokenTypesFilters = useGetTokenTypeFilters();

  const tokenItems = tokenTypesFilters.map(
    ({
      token: {
        symbol,
        name,
        tokenAddress,
        avatar,
        chainMetadata: { chainId },
      },
    }) => ({
      symbol,
      label: (
        <div className="flex items-center gap-2">
          <TokenAvatar
            size={18}
            tokenName={name}
            tokenAddress={tokenAddress}
            tokenAvatarSrc={avatar ?? undefined}
          />
          {multiLineTextEllipsis(symbol, 5)}
        </div>
      ),
      name: tokenAddress || '',
      key: `${chainId}-${symbol}`,
    }),
  );

  return (
    <div>
      <h5 className="hidden px-3.5 pb-2 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'balancePage.filter.approvedTokenTypes' })}
      </h5>
      <ul>
        {tokenItems.map(({ label, name, key }) => {
          const isChecked = tokenFilters[name];

          return (
            <li key={key}>
              <Checkbox
                className="subnav-button px-0 sm:px-3.5"
                name={name}
                onChange={(event) => handleFiltersChange(event, 'token')}
                isChecked={isChecked}
              >
                {label}
              </Checkbox>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TokenFilters;
