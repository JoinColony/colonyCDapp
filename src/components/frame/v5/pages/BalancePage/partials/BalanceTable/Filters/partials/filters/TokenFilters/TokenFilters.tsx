import React, { type FC } from 'react';

import { useFiltersContext } from '~frame/v5/pages/BalancePage/partials/BalanceTable/Filters/FiltersContext/FiltersContext.ts';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { useGetTokenTypeFilters } from './hooks.ts';

const TokenFilters: FC = () => {
  const { tokenTypes, handleTokenTypesFilterChange } = useFiltersContext();
  const tokenTypesFilters = useGetTokenTypeFilters();
  const tokenItems = tokenTypesFilters.map(({ token }) => ({
    symbol: token.symbol,
    label: (
      <div className="flex items-center gap-2">
        <TokenAvatar
          size={18}
          tokenName={token.name}
          tokenAddress={token.tokenAddress}
          tokenAvatarSrc={token.avatar ?? undefined}
        />
        {multiLineTextEllipsis(token.symbol, 5)}
      </div>
    ),
    name: token?.tokenAddress || '',
  }));

  return (
    <div>
      <h5 className="hidden px-3.5 pb-2 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'balancePage.filter.approvedTokenTypes' })}
      </h5>
      <ul>
        {tokenItems.map(({ label, name }) => {
          const isChecked = tokenTypes[name];

          return (
            <li key={name}>
              <Checkbox
                className="subnav-button px-0 sm:px-3.5"
                name={name}
                onChange={handleTokenTypesFilterChange}
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
