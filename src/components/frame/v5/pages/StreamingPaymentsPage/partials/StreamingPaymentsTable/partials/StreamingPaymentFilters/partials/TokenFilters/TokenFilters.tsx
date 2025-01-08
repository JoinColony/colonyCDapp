import React, { type FC } from 'react';

import { useStreamingFiltersContext } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/FiltersContext/StreamingFiltersContext.ts';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import Checkbox from '~v5/common/Checkbox/index.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { useGetTokenTypeFilters } from './hooks.ts';

const TokenFilters: FC = () => {
  const { tokenTypes, handleTokenTypesFilterChange } =
    useStreamingFiltersContext();
  const tokenTypesFilters = useGetTokenTypeFilters();

  return (
    <div>
      <h5 className="hidden px-3.5 pb-2 uppercase text-gray-400 text-4 sm:block">
        {formatText({ id: 'balancePage.filter.approvedTokenTypes' })}
      </h5>
      <ul>
        {tokenTypesFilters.map(({ token }) => {
          const name = token?.tokenAddress || '';
          const isChecked = tokenTypes[name];

          return (
            <li key={name}>
              <Checkbox
                classNames="subnav-button px-0 sm:px-3.5"
                name={name}
                onChange={handleTokenTypesFilterChange}
                isChecked={isChecked}
              >
                <div className="flex items-center gap-2">
                  <TokenAvatar
                    size={18}
                    tokenName={token.name}
                    tokenAddress={token.tokenAddress}
                    tokenAvatarSrc={token.avatar ?? undefined}
                  />
                  {multiLineTextEllipsis(token.symbol, 5)}
                </div>
              </Checkbox>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TokenFilters;
