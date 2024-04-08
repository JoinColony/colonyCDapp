import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { useFiltersContext } from '../../../FiltersContext/FiltersContext.ts';

import { useGetTokenTypeFilters } from './hooks.ts';

const TokenFilters: FC = () => {
  const { tokenTypes, handleTokenTypesFilterChange } = useFiltersContext();
  const tokenTypesFilters = useGetTokenTypeFilters();
  const tokenItems = tokenTypesFilters.map(({ token }) => ({
    symbol: token.symbol,
    label: (
      <div className="flex items-center gap-2">
        <TokenAvatar
          size={16}
          tokenName={token.name}
          tokenAddress={token.tokenAddress}
          tokenAvatarSrc={token.avatar ?? undefined}
        />
        {token.symbol}
      </div>
    ),
    name: token?.tokenAddress || '',
  }));

  return (
    <div>
      <h5 className="hidden px-3.5 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'balancePage.filter.approvedTokenTypes' })}
      </h5>
      <ul>
        {tokenItems.map(({ label, name }) => {
          const isChecked = tokenTypes[name];

          return (
            <li key={name}>
              <Checkbox
                classNames="subnav-button px-0 sm:px-3.5"
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
